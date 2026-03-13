
export async function uploadFileToServer(file: File, folder: string = "/expense-manager", customName?: string): Promise<{ url: string; fileId: string; name: string } | null> {
    const formData = new FormData();
    formData.append("file", file);
    if (customName) formData.append("customName", customName);
    if (folder) formData.append("folder", folder);

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}
