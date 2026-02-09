import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Post({
  post,
  justNow,
  liked,
  onLike,
}: {
  post: {
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
  justNow: boolean;
  liked: boolean;
  onLike: () => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 mb-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0"
              whileHover={{ scale: 1.15, boxShadow: "0 0 8px #3B82F6" }}
            >
              <span className="text-[#3B82F6] font-bold text-sm">
                {post.initials}
              </span>
            </motion.div>
            <div>
              <p className="font-medium">{post.name}</p>
              <p className="text-sm text-gray-500">{post.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <AnimatePresence>
                  {justNow ? (
                    <>
                      <motion.span
                        className="text-xs text-green-600 font-semibold"
                        key="justnow"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                      >
                        Posted just now
                      </motion.span>
                      <motion.span
                        className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-1"
                        key="newbadge"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        New!
                      </motion.span>
                    </>
                  ) : (
                    <motion.span
                      className="text-xs text-gray-400"
                      key="time"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      {post.time}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <motion.p
            className="text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {post.content}
          </motion.p>
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-[#EFF6FF] text-[#1D4ED8] border-transparent hover:bg-[#EFF6FF]/80"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <motion.button
            className="flex items-center gap-1"
            whileTap={{ scale: 1.2 }}
            onClick={onLike}
          >
            <Heart
              className={`w-4 h-4 ${liked ? "text-red-500" : ""}`}
              style={{ transition: "color 0.2s" }}
            />
            <span>{post.likes + (liked ? 1 : 0)} likes</span>
          </motion.button>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{post.shares} shares</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 flex text-sm">
        <motion.button className="flex-1 p-2 hover:bg-gray-50 text-gray-600 transition-colors">
          Like
        </motion.button>
        <motion.button className="flex-1 p-2 hover:bg-gray-50 text-gray-600 transition-colors">
          Comment
        </motion.button>
        <motion.button className="flex-1 p-2 hover:bg-gray-50 text-gray-600 transition-colors">
          Repost
        </motion.button>
      </div>
    </motion.div>
  );
}
