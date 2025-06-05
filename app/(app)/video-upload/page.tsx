"use client";
import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { UploadCloudIcon, AlertCircleIcon } from 'lucide-react';

const VideoUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const router = useRouter();
    //max file size 70mb
    const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70 MB

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds the maximum limit of 70MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('originalSize', file.size.toString());

        try {
            const response = await axios.post('/api/video-upload', formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });
            
            if (response.status === 200) {
                alert("Video uploaded successfully");
                router.push('/home'); // Redirect to home page
            } else {
                alert("Failed to upload video");
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to upload video");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

  return (
        <div className="container mx-auto max-w-2xl">
          <div className="glass-panel p-3">
            <h1 className="text-2xl font-bold mb-6 text-white text-center">Upload Video</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input"
                  required
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input min-h-[120px]"
                  placeholder="Enter video description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Video File
                </label>
                <div 
                  className={`file-drop-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <UploadCloudIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-4">
                    Drag and drop your video here, or click to browse
                  </p>
                  <div className="relative w-full">
                    <input
                      id="fileInput"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {!file && (
                      <div className="flex flex-col items-center space-y-2">
                        <label
                          htmlFor="fileInput"
                          className="px-5 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm cursor-pointer transition-all hover:bg-gray-700/50"
                        >
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500">No file chosen</span>
                      </div>
                    )}
                  </div>
                  
                  {file && (
                    <div className="mt-4 w-full px-4 py-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <label
                          htmlFor="fileInput"
                          className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer"
                        >
                          Change
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {file && file.size > MAX_FILE_SIZE && (
                  <div className="mt-2 flex items-center text-red-400 text-sm">
                    <AlertCircleIcon className="w-4 h-4 mr-1" />
                    File exceeds the 70MB size limit
                  </div>
                )}
              </div>
              {isUploading && (
                <div className="w-full mt-4">
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-gray-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                    <div 
                      className="bg-gray-400 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 rounded-lg bg-gray-800/80 border border-gray-700/50 text-white font-medium transition-all hover:bg-gray-700/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/80"
                disabled={isUploading || !file || file.size > MAX_FILE_SIZE}
              >
                {isUploading ? "Uploading..." : "Upload Video"}
              </button>
            </form>
          </div>
        </div>
      );
}

export default VideoUpload