import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "placeholder_public_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "placeholder_private_key",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/placeholder",
});

export const uploadImage = async (file: File, fileName?: string, folder: string = "/expense-manager") => {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await imagekit.upload({
        file: buffer,
        fileName: fileName || file.name || `file-${Date.now()}`,
        folder: folder,
        useUniqueFileName: false
    });
};

export const deleteImage = async (url: string) => {
    try {
        console.log(`[ImageKit] Attempting to delete image: ${url}`);
        
        // Extract pure file path from URL to verify exact match
        // Example: https://ik.imagekit.io/id/folder/file.jpg -> /folder/file.jpg
        const urlObj = new URL(url);
        const urlPath = decodeURIComponent(urlObj.pathname);
        
        const urlParts = url.split("/");
        let fileName = urlParts[urlParts.length - 1];
        
        // Remove query params if any
        fileName = fileName.split("?")[0];
        // Decode special chars
        fileName = decodeURIComponent(fileName);

        console.log(`[ImageKit] Searching for file with name: ${fileName}`);

        let files = await imagekit.listFiles({
            searchQuery: `name = "${fileName}"`
        });

        // Fallback: If not found, try searching without extension
        if (!files || files.length === 0) {
            const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
            if (nameWithoutExt && nameWithoutExt !== fileName) {
                console.log(`[ImageKit] Searching fallback with name: ${nameWithoutExt}`);
                files = await imagekit.listFiles({
                    searchQuery: `name = "${nameWithoutExt}"`
                });
            }
        }

        console.log(`[ImageKit] Found ${files?.length || 0} candidate files.`);

        if (files && files.length > 0) {
            
            const candidateFiles = files.filter(f => 'filePath' in f) as unknown as { filePath: string; fileId: string; name: string }[];

            let match = candidateFiles.find(f => urlPath.endsWith(f.filePath));
            
            if (!match) {
                 match = candidateFiles.find(f => urlPath.includes(f.filePath));
            }

          
            if (!match) {
                 match = candidateFiles.find(f => f.name === fileName);
            }

            if (match) {
                console.log(`[ImageKit] Deleting matched file: ${match.filePath} (${match.fileId})`);
                await imagekit.deleteFile(match.fileId);
                return true;
            } else {
                console.warn(`[ImageKit] No matching path found for ${url} among candidates.`);
            }
        } else {
             console.warn(`[ImageKit] No files found for ${fileName}`);
        }
        return false;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
};
