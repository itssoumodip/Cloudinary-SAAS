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

    return (
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="bg-black border border-gray-800 rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-white text-center">Upload Video</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full bg-gray-900 border-gray-700 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea w-full bg-gray-900 border-gray-700 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500 min-h-[120px]"
                  placeholder="Enter video description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video File
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                    dragActive ? "border-white bg-gray-900" : "border-gray-700 hover:border-gray-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-300 text-center mb-4">
                    Drag and drop your video here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="file-input file-input-bordered w-full bg-gray-800 border-gray-700 text-white"
                    required={!file}
                  />
                  {file && (
                    <div className="mt-4 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
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
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-300">Uploading...</span>
                    <span className="text-gray-300">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="btn w-full bg-white text-black hover:bg-gray-300 focus:outline-none disabled:bg-gray-600 disabled:text-gray-400 mt-4"
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