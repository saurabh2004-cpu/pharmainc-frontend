
import React from "react";
import { 
  Search, Microscope, BookOpen, Users, Calendar, 
  Download, Heart, Share2, Bookmark, Filter,
  TrendingUp, Award, Clock, Globe, MessageSquare,
  Eye, ThumbsUp, Plus, MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "../_components/LandingNavbar";
import Footer from "../_components/Footer";

const Research = () => {
  const researchPosts = [
    {
      id: 1,
      author: {
        name: "Dr. Sarah Chen",
        avatar: "https://i.pravatar.cc/300?img=5",
        title: "Emergency Medicine Specialist",
        hospital: "Johns Hopkins Hospital"
      },
      title: "AI-Powered Diagnostic Tools in Emergency Medicine: A Breakthrough Study",
      content: "Excited to share our latest research on implementing AI diagnostic tools in emergency departments. Our 15-hospital study shows 34% improvement in diagnostic accuracy and 28% reduction in patient wait times. This could revolutionize emergency care worldwide.",
      journal: "Journal of Emergency Medicine",
      category: "Emergency Medicine",
      tags: ["AI", "Emergency Medicine", "Diagnostics", "Healthcare Technology"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
      stats: {
        likes: 234,
        comments: 45,
        shares: 67,
        views: 2456
      },
      time: "3h ago",
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      author: {
        name: "Dr. Robert Kim",
        avatar: "https://i.pravatar.cc/300?img=1",
        title: "Pediatric Cardiologist",
        hospital: "Stanford Children's Hospital"
      },
      title: "Revolutionary Pediatric Cardiology Techniques: 5-Year Longitudinal Study Results",
      content: "After 5 years of dedicated research, we're thrilled to present our findings on innovative surgical techniques for pediatric patients with congenital heart defects. The results show 40% better long-term outcomes compared to traditional methods.",
      journal: "Pediatric Cardiology International",
      category: "Pediatric Cardiology",
      tags: ["Pediatrics", "Cardiology", "Surgery", "Long-term Care"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=800&auto=format&fit=crop",
      stats: {
        likes: 189,
        comments: 32,
        shares: 41,
        views: 1834
      },
      time: "6h ago",
      isLiked: true,
      isBookmarked: true
    },
    {
      id: 3,
      author: {
        name: "Dr. Maria Lopez",
        avatar: "https://i.pravatar.cc/300?img=9",
        title: "Neurologist & Research Director",
        hospital: "Mayo Clinic"
      },
      title: "Early Alzheimer's Detection: Neural Imaging Breakthrough",
      content: "Groundbreaking news in neurology! Our team has developed neural imaging techniques that can detect Alzheimer's disease 7-10 years before clinical symptoms appear. This advancement could transform preventive care strategies for millions worldwide.",
      journal: "Neurology Research Quarterly",
      category: "Neurology",
      tags: ["Neurology", "Alzheimer's", "Early Detection", "Neural Imaging"],
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
      stats: {
        likes: 412,
        comments: 78,
        shares: 156,
        views: 3721
      },
      time: "1d ago",
      isLiked: false,
      isBookmarked: false
    }
  ];

  const trendingTopics = [
    "AI in Healthcare", "Telemedicine", "Precision Medicine", "Gene Therapy", 
    "Medical Robotics", "Digital Health", "Personalized Treatment", "Clinical Trials"
  ];

  const researchCategories = [
    { name: "Cardiology", count: 234, color: "bg-blue-100 text-blue-700" },
    { name: "Neurology", count: 189, color: "bg-blue-100 text-blue-700" },
    { name: "Pediatrics", count: 156, color: "bg-blue-100 text-blue-700" },
    { name: "Emergency Medicine", count: 143, color: "bg-blue-100 text-blue-700" },
    { name: "Oncology", count: 128, color: "bg-blue-100 text-blue-700" },
    { name: "Infectious Disease", count: 98, color: "bg-blue-100 text-blue-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Sidebar */}
            <aside className="col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Research Categories
                </h3>
                <div className="space-y-3">
                  {researchCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between hover:bg-blue-50 p-3 rounded-xl cursor-pointer transition-all duration-200">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <Badge className={`${category.color} text-xs`}>
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Badge 
                      key={topic} 
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer transition-colors"
                    >
                      #{topic.replace(/\s+/g, '')}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Feed */}
            <div className="col-span-6">
              {/* Create Post */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/pp.png" alt="Your Profile" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      placeholder="Share your latest research findings..."
                      className="bg-blue-50/50 border-blue-200 rounded-xl"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>

              {/* Research Posts */}
              <div className="space-y-6">
                {researchPosts.map((post) => (
                  <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Post Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                            <p className="text-sm text-gray-600">{post.author.title}</p>
                            <p className="text-sm text-blue-600">{post.author.hospital}</p>
                            <p className="text-xs text-gray-400">{post.time}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-700 mt-3">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <div className="px-6 pb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="px-6 pb-4">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="px-6 py-4 border-t border-blue-100 bg-blue-50/30">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.stats.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Downloads
                          </span>
                        </div>
                        <span>{post.journal}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-2 ${post.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.stats.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                            <MessageSquare className="h-4 w-4" />
                            {post.stats.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                            <Share2 className="h-4 w-4" />
                            {post.stats.shares}
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${post.isBookmarked ? 'text-yellow-600' : 'text-gray-600'} hover:text-yellow-600`}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="px-8 border-blue-200 text-blue-700 hover:bg-blue-50">
                  Load More Research
                </Button>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Featured Researchers
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Dr. Emily Chen", field: "Cardiology", avatar: "https://i.pravatar.cc/300?img=7" },
                    { name: "Dr. Michael Rodriguez", field: "Neurology", avatar: "https://i.pravatar.cc/300?img=8" },
                    { name: "Dr. Sarah Kim", field: "Pediatrics", avatar: "https://i.pravatar.cc/300?img=10" }
                  ].map((researcher, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={researcher.avatar} alt={researcher.name} />
                        <AvatarFallback>{researcher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{researcher.name}</p>
                        <p className="text-xs text-gray-600">{researcher.field}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Conferences
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Medical AI Summit", date: "Dec 15-17", location: "Virtual" },
                    { name: "Cardiology Innovation", date: "Jan 20-22", location: "Boston" },
                    { name: "Global Health Forum", date: "Feb 8-10", location: "Geneva" }
                  ].map((conference, index) => (
                    <div key={index} className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <h4 className="font-medium text-sm text-gray-900">{conference.name}</h4>
                      <p className="text-xs text-gray-600">{conference.date}</p>
                      <p className="text-xs text-blue-600">{conference.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Research;
