"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  ChevronRight, 
  UserPlus,
  MessageSquare,
  Calendar,
  Edit
} from "lucide-react";

export function ProfileRightSidebar() {
  const router = useRouter();

  // Mock data for suggestions
  const connectionSuggestions = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatarUrl: "/pp.png",
      mutualConnections: 5
    },
    {
      id: "2", 
      name: "Dr. Michael Chen",
      role: "Pharmacist",
      avatarUrl: "/pp.png",
      mutualConnections: 3
    },
    {
      id: "3",
      name: "Dr. Lisa Anderson",
      role: "Researcher",
      avatarUrl: "/pp.png",
      mutualConnections: 8
    }
  ];

  const trendingTopics = [
    { tag: "#CardiacResearch", posts: "2.1k posts" },
    { tag: "#PharmaTech", posts: "1.8k posts" },
    { tag: "#MedicalAI", posts: "3.2k posts" },
    { tag: "#DrugDiscovery", posts: "925 posts" }
  ];

  const recentActivity = [
    {
      type: "post",
      icon: Edit,
      action: "Published research",
      content: "New findings in cardiovascular medicine",
      time: "2h ago"
    },
    {
      type: "join",
      icon: Users,
      action: "Joined group",
      content: "Advanced Pharmacy Research",
      time: "1d ago"
    },
    {
      type: "event",
      icon: Calendar,
      action: "Attending event",
      content: "Medical Innovation Summit 2025",
      time: "3d ago"
    }
  ];

  const handleShowMoreConnections = () => {
    // Navigate to notifications page and open connections tab
    router.push('/notifications?tab=connections');
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            People You May Know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {connectionSuggestions.slice(0, 3).map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.avatarUrl} alt={person.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                  <p className="text-xs text-blue-600">{person.mutualConnections} mutual connections</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full">
                <UserPlus className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="w-full text-blue-600 hover:bg-blue-50 mt-3"
            onClick={handleShowMoreConnections}
          >
            Show more connections
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Trending in Healthcare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm text-blue-600">{topic.tag}</p>
                <p className="text-xs text-gray-500">{topic.posts}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium text-gray-900">{activity.action}</span>
                </p>
                <p className="text-xs text-gray-600 truncate">{activity.content}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50 mt-3">
            View all activity
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start a conversation
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Find colleagues
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule meeting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
