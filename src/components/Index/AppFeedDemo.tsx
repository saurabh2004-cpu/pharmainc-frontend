"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Index/Feed/Header";
import { Input } from "@/components/Index/Feed/Input";
import { Post } from "@/components/Index/Feed/Post";

const postsList = [
  {
    id: 1,
    initials: "RK",
    name: "Dr. Robert Kim",
    title: "Neurologist at Mass General Hospital",
    time: "2 hours ago",
    content:
      "Just published our latest research on neural pathways in Alzheimer's patients. The findings suggest a new potential approach to early intervention. Link to the paper in comments.",
    tags: ["#Neurology", "#Alzheimer", "#Research"],
    likes: 67,
    comments: 34,
    shares: 14,
  },
  {
    id: 2,
    initials: "EM",
    name: "Dr. Elena Martinez",
    title: "Cardiologist at Cleveland Clinic",
    time: "5 hours ago",
    content:
      "Fascinating case today: 42-year-old patient with unusual ECG patterns showing intermittent Wenckebach phenomenon without symptoms. Anyone encountered similar cases recently?",
    tags: ["#Cardiology", "#ECG", "#CaseStudy"],
    likes: 56,
    comments: 23,
    shares: 7,
  },
];

const feedStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.5 } },
};

type PostType = {
  id: number;
  initials: string;
  name: string;
  title: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
};

export const AppFeedDemo = () => {
  const [visiblePosts, setVisiblePosts] = useState<PostType[]>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [justNow, setJustNow] = useState<{ [key: number]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (postIndex < postsList.length) {
      const timer = setTimeout(() => {
        setVisiblePosts((prev) => [...prev, postsList[postIndex]]);
        setJustNow((prev) => ({
          ...prev,
          [postsList[postIndex].id]: true,
        }));
        setPostIndex((idx) => idx + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [postIndex]);

  useEffect(() => {
    Object.keys(justNow).forEach((id) => {
      if (justNow[id]) {
        setTimeout(() => {
          setJustNow((prev) => ({
            ...prev,
            [id]: false,
          }));
        }, 2500);
      }
    });
  }, [justNow]);

  const toggleLike = (id) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Header />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-[#3B82F6] px-6 py-3 text-white flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-2 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 mr-auto animate-pulse"></div>
              <span className="text-sm font-medium">Your Medical Feed</span>
            </div>
            <div className="p-6">
              <Input />
              <motion.div
                variants={feedStagger}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {visiblePosts.map((post) => (
                    <Post
                      key={post.id}
                      post={post}
                      justNow={!!justNow[post.id]}
                      liked={!!likedPosts[post.id]}
                      onLike={() => toggleLike(post.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
