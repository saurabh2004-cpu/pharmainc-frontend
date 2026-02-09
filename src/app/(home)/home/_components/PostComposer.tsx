"use client";

import { Image, FileIcon, Link2, FileText, Filter } from "lucide-react";
import { User } from "./types";
import Link from "next/link";
import { useState } from "react";
import PostModal from "./PostModal";

interface PostComposerProps {
  user: User;
}

export default function PostComposer({ user }: PostComposerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full px-4 py-4 sm:px-6 font-sans mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold font-sans">Your Feed</h2>
          <Link href="/posts/filter" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-sans">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Link>
        </div>

        <div className="flex gap-3 mb-4">
          <img
            src={user?.profilePicture || "/pp.png"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <button
              onClick={openModal}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-4 py-3 text-gray-500 text-left transition-colors font-sans"
            >
              Share your medical insights...
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={openModal}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm transition-colors whitespace-nowrap font-sans"
            >
              <Image className="h-5 w-5" />
              <span className="hidden sm:inline">Photo/Video</span>
            </button>
            <button
              onClick={openModal}
              className="flex items-center gap-2 text-green-500 hover:text-green-600 text-sm transition-colors whitespace-nowrap font-sans"
            >
              <FileIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Document</span>
            </button>
            <button
              onClick={openModal}
              className="flex items-center gap-2 text-purple-500 hover:text-purple-600 text-sm transition-colors whitespace-nowrap font-sans"
            >
              <Link2 className="h-5 w-5" />
              <span className="hidden sm:inline">Link</span>
            </button>
            <button
              onClick={openModal}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm transition-colors whitespace-nowrap font-sans"
            >
              <FileText className="h-5 w-5" />
              <span className="hidden sm:inline">Research</span>
            </button>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors font-sans flex-shrink-0 ml-2"
          >
            Post
          </button>
        </div>
      </div>

      <PostModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        user={user}
      />
    </>
  );
}
