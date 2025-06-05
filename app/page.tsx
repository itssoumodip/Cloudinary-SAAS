import Image from "next/image";
import Link from "next/link";
import { FileVideo2, Share2Icon, Upload, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center relative z-10">
        {/* Hero Section */}
        <div className="w-full max-w-5xl text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Cloudinary <span className="text-blue-500">Showcase</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Advanced media management with Cloudinary. Compress videos, optimize images, 
            and create perfect social media assets all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/video-upload"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <Upload size={20} />
              <span>Upload Video</span>
            </Link>
            <Link 
              href="/social-share"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium border border-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <Share2Icon size={20} />
              <span>Social Image Tools</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
          {/* Feature 1 */}
          <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-gray-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-blue-900/30 p-3 rounded-lg inline-block mb-4">
              <FileVideo2 size={28} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Video Compression</h3>
            <p className="text-gray-400">
              Automatically compress videos without quality loss. Save bandwidth and storage while maintaining clarity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-gray-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <Share2Icon size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Social Media Formats</h3>
            <p className="text-gray-400">
              Create perfectly sized images for every social platform. Instagram, Twitter, Facebook, and more with a single click.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-gray-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-green-900/30 p-3 rounded-lg inline-block mb-4">
              <Upload size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Cloud Storage</h3>
            <p className="text-gray-400">
              Store all your media files securely in the cloud. Access and manage them from anywhere with our intuitive dashboard.
            </p>
          </div>        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 md:p-12 rounded-2xl border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-gray-300">
                Sign in now and experience the power of Cloudinary with our intuitive tools.
              </p>
            </div>
            <Link 
              href="/home" 
              className="whitespace-nowrap px-8 py-4 bg-white text-black font-medium rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 hover:bg-gray-100"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>      </div>
    </div>
  );
}
