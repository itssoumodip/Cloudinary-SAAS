import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');
        const videoId = searchParams.get('videoId');

        if (!publicId || !videoId) {
            return NextResponse.json(
                { error: 'Public ID and Video ID are required' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

        // Delete from database
        await prisma.video.delete({
            where: {
                id: videoId
            }
        });

        return NextResponse.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete video failed:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
