import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import { Download, Clock, FileDown, FileUp, Play, ArrowDown, Trash2 } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
import { Video } from '@/types';
import Image from 'next/image';

dayjs.extend(relativeTime);

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onDelete?: (videoId: string, publicId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({video, onDownload, onDelete}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        });
    }, []);

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
            format: 'mp4',
            quality: 'auto',
            rawTransformations: [
                "f_mp4",
                "vc_auto",
                "q_auto"
            ]
        });
    }, []);

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            format: 'mp4',
            quality: 'auto',
            rawTransformations: [
                "f_mp4",
                "vc_auto",
                "q_auto",
                "so_0" // Start playing from the beginning to avoid preview errors
            ]
        });
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }, []);

      const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
      );      useEffect(() => {
        setIsLoading(true);
      }, [isHovered]);

      const handlePreviewError = () => {
        setIsLoading(false);
      };
      
      const handlePreviewLoad = () => {
        setIsLoading(false);
      };

      const handleDelete = async () => {
        if (!onDelete || isDeleting) return;
        
        if (window.confirm('Are you sure you want to delete this video?')) {
            setIsDeleting(true);
            try {
                await onDelete(video.id, video.publicId);
            } catch (error) {
                console.error('Failed to delete video:', error);
                alert('Failed to delete video');
            } finally {
                setIsDeleting(false);
            }
        }
    };

      return (
        <div
            className="overflow-hidden rounded-xl bg-black shadow-md hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 border border-gray-800"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Video Preview Section */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                {/* Thumbnail or Preview */}
                {isHovered ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover transform scale-105 transition-transform duration-700"
                            onError={handlePreviewError}
                            onLoadedData={handlePreviewLoad}
                        />
                    </>
                ) : (
                    <>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform border border-white/30 backdrop-blur-sm">
                                <Play size={28} className="text-white ml-1" />
                            </div>
                        </div>
                        <Image 
                          src={getThumbnailUrl(video.publicId)} 
                          alt={video.title} 
                          width={320} 
                          height={180} 
                          className="w-full h-full object-cover" 
                        />
                    </>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow flex items-center border border-gray-700">
                    <Clock size={12} className="mr-1.5 text-gray-400" />
                    {formatDuration(video.duration)}
                </div>

                {/* Compression Badge */}
                <div className="absolute top-3 left-3">
                    <div className="px-2 py-1 rounded-md bg-gray-800 text-white text-xs font-semibold shadow-sm border border-gray-700">
                        {compressionPercentage}% compressed
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Video Info */}
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-white line-clamp-1 mb-1">
                        {video.title}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                        {video.description || "No description provided"}
                    </p>
                    <p className="text-xs text-gray-500">
                        Uploaded {dayjs(video.createdAt).fromNow()}
                    </p>
                </div>

                {/* File Stats */}
                <div className="flex items-center justify-between p-3 mb-4 bg-gray-900 rounded-lg border border-gray-800">
                    <div className="flex items-center space-x-4">
                        {/* Original Size */}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Original</span>
                            <div className="flex items-center space-x-1">
                                <FileUp size={14} className="text-white" />
                                <span className="text-sm font-mono text-gray-300">
                                    {formatSize(Number(video.originalSize))}
                                </span>
                            </div>
                        </div>
                        
                        {/* Arrow */}
                        <ArrowDown size={14} className="text-gray-600 rotate-270 mt-3" />
                        
                        {/* Compressed Size */}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Compressed</span>
                            <div className="flex items-center space-x-1">
                                <FileDown size={14} className="text-white" />
                                <span className="text-sm font-mono text-gray-300">
                                    {formatSize(Number(video.compressedSize))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>                
            

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-300 text-black rounded-lg transition-colors"
                    >
                        <Download size={16} />
                        <span>Download</span>
                    </button>

                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={16} />
                            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
      );
}

export default VideoCard