import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    throw new Error('Cloudinary environment variables are not properly configured');
}

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    format: string;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "next-cloudinary-uploads",
                    resource_type: "auto",
                    transformation: [
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload failed:", error);
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            publicId: result.public_id,
            url: result.secure_url,
            format: result.format
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Upload image failed:", error);
        return NextResponse.json(
            { error: "Upload failed. Please try again." },
            { status: 500 }
        );
    }
}

// Example fix for the suggested change
// const data: { secure_url: string; public_id: string } = await response.json();