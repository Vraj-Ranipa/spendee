import { imagekit, uploadImage, deleteImage } from "@/lib/imagekit"; // Add deleteImage import
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const customName = formData.get("customName") as string;
        
        const folder = formData.get("folder") as string || "/expense-manager";

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Generate unique ID (using timestamp for simplicity and readability)
        // const uniqueId = Date.now().toString(); // Too long
        const uniqueId = Math.random().toString(36).substring(2, 8); // ~6 chars, e.g. "x7z91a"
        let finalFileName;

        // Extract extension
        const nameParts = file.name.split('.');
        let ext = "";
        if (nameParts.length > 1) {
            ext = "." + nameParts.pop();
        }

        if (customName && customName.trim() !== "") {
            // Case 1: Custom name provided -> Append ID AND Extension
            finalFileName = `${customName.trim()}-${uniqueId}${ext}`;
        } else {
            // Case 2: Default "image" -> Append ID and extension
            finalFileName = `image-${uniqueId}${ext}`;
        }

        const uploadResponse = await uploadImage(
            file, 
            finalFileName, 
            folder
        );

        return NextResponse.json({
            url: uploadResponse.url,
            name: uploadResponse.name,
            fileId: uploadResponse.fileId
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { fileId, url } = await request.json();

        if (fileId) {
             await imagekit.deleteFile(fileId);
             return NextResponse.json({ success: true });
        } else if (url) {
             const success = await deleteImage(url);
             if (success) {
                 return NextResponse.json({ success: true });
             } else {
                 return NextResponse.json({ error: "File not found or failed to delete" }, { status: 404 });
             }
        }

        return NextResponse.json(
            { error: "No file ID or URL provided" },
            { status: 400 }
        );

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        );
    }
}
