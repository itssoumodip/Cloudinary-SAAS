import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@/generated/prisma';


const prisma = new PrismaClient()

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click to 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: unknown
}

export async function POST(request: NextRequest) {


    try {

        // Check user authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ){
            return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
        }


        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400})
        }

        // Validate file size (70MB limit as per frontend)
        if (file.size > 70 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 70MB limit" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation: [
                            {quality: "auto", fetch_format: "mp4"},
                        ]
                    },
                    (error, result) => {
                        if(error) {
                            console.error("Cloudinary upload failed:", error);
                            reject(error);
                        }
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
                userId: userId,
            }
        })
        return NextResponse.json(video)

    } catch (error) {
        console.error("Upload video failed:", error)
        return NextResponse.json({
            error: "Upload video failed. Please try again.",
            details: error instanceof Error ? error.message : "Unknown error"
        }, {status: 500})
    } finally{
        await prisma.$disconnect()
    }

}