"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { RefreshCw, FileVideo2, Search } from 'lucide-react'

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchVideos = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
                setError(null);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")
        } finally {
            setLoading(false)
            if (showRefreshing) setRefreshing(false);
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [])

    // Filter videos based on search term
    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if(loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-white/30 border-solid rounded-full animate-spin opacity-20"></div>
                    <div className="absolute inset-3 border-4 border-white border-solid rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-gray-300">Loading your videos...</p>
            </div>
        );
    }

    if(error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="bg-black/30 border border-red-900/50 rounded-full p-6">
                    <div className="w-16 h-16 text-red-400"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xl font-semibold text-red-400">{error}</p>
                    <p className="text-gray-400">There was an error fetching your videos. Please try again.</p>
                </div>
                <button
                    className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition duration-200 flex items-center space-x-2"
                    onClick={() => fetchVideos()}
                >
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with search */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-gray-800">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <FileVideo2 className="text-white" />
                    Your Videos
                </h1>
                
                <div className="flex space-x-3">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search videos..."
                            className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-white focus:border-gray-600 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Refresh button */}
                    <button
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 transition duration-200 border border-gray-700"
                        onClick={() => fetchVideos(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-white' : ''}`} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 mt-8 bg-black rounded-xl shadow-sm border border-gray-800">
                    <div className="bg-gray-900 p-6 rounded-full mb-6 border border-gray-800">
                        <FileVideo2 className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-center max-w-md space-y-3">
                        <h3 className="text-2xl font-bold text-white">No Videos Yet</h3>
                        <p className="text-gray-400">
                            Upload your first video to get started with our compression and preview features.
                        </p>
                        <button 
                            className="mt-4 inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-lg transition duration-200"
                            onClick={() => window.location.href = '/video-upload'}
                        >
                            Upload a Video
                        </button>
                    </div>
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 mt-8 bg-black rounded-xl shadow-sm border border-gray-800">
                    <div className="bg-gray-900 p-6 rounded-full mb-6 border border-gray-800">
                        <Search className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-center max-w-md">
                        <h3 className="text-2xl font-bold text-white mb-2">No matching videos</h3>
                        <p className="text-gray-400">
                            We couldn't find any videos matching "{searchTerm}". Try a different search term.
                        </p>
                        <button
                            className="mt-4 px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition duration-200 text-white border border-gray-700"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear Search
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video.id} video={video} onDownload={handleDownload} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home