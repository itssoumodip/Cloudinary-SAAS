"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';
import { DownloadIcon, UploadCloudIcon } from 'lucide-react';

const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  };

  type SocialFormat = keyof typeof socialFormats;

  export default function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        if(uploadedImage){
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData
            })

            if(!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setUploadedImage(data.publicId);


        } catch (error) {
            console.log(error)
            alert("Failed to upload image");
        } finally{
            setIsUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("/api/image-upload", {
                    method: "POST",
                    body: formData
                });

                if(!response.ok) throw new Error("Failed to upload image");

                const data = await response.json();
                setUploadedImage(data.publicId);

            } catch (error) {
                console.log(error);
                alert("Failed to upload image");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDownload = () => {
        if(!imageRef.current) return;

        fetch(imageRef.current.src)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
    }


    return (
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="bg-black border border-gray-800 rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
              Social Media Image Creator
            </h1>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Upload an Image</h2>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
                  dragActive ? "border-white bg-gray-900" : "border-gray-700 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-300 text-center mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered w-full bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="w-full flex justify-center">
                    <div className="loading loading-spinner loading-lg text-white"></div>
                  </div>
                </div>
              )}

              {uploadedImage && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-white">Select Format</h2>
                  <div className="form-control">
                    <select
                      className="select w-full bg-gray-900 border-gray-700 text-white"
                      value={selectedFormat}
                      onChange={(e) =>
                        setSelectedFormat(e.target.value as SocialFormat)
                      }
                    >
                      {Object.keys(socialFormats).map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-white">Preview:</h3>
                    <div className="flex justify-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                      {isTransforming && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10 rounded-lg">
                          <span className="loading loading-spinner loading-lg text-white"></span>
                        </div>
                      )}
                      <div className="relative max-w-full overflow-hidden shadow-lg">
                        <CldImage
                          width={socialFormats[selectedFormat].width}
                          height={socialFormats[selectedFormat].height}
                          src={uploadedImage}
                          sizes="100vw"
                          alt="transformed image"
                          crop="fill"
                          aspectRatio={socialFormats[selectedFormat].aspectRatio}
                          gravity='auto'
                          ref={imageRef}
                          onLoad={() => setIsTransforming(false)}
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button 
                      className="btn bg-white text-black hover:bg-gray-300 gap-2"
                      onClick={handleDownload}
                      disabled={isTransforming}
                    >
                      <DownloadIcon className="w-5 h-5" />
                      Download for {selectedFormat}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}