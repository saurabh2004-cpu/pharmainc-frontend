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
  Edit,
  Building2,
  Settings,
  FileText,
  Eye
} from "lucide-react";
import { useUserStore, useInstitutionStore } from "@/store";
import { getUserType } from "@/lib/api/utils";

export function InstituteRightSidebar() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { currentInstitution } = useInstitutionStore();
  const userType = getUserType();

  const isOwnInstitute = userType === 'institution' && currentInstitution;
  const currentEntity = userType === 'institution' ? currentInstitution : currentUser;

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

  const instituteTrends = [
    { tag: "#InstitutionalResearch", posts: "1.2k posts" },
    { tag: "#AcademicCollaboration", posts: "890 posts" },
    { tag: "#HealthcareInnovation", posts: "2.1k posts" },
    { tag: "#MedicalEducation", posts: "756 posts" }
  ];

  const recentInstitutionalActivity = [
    {
      type: "publication",
      icon: FileText,
      action: "Published research",
      content: "Breakthrough in cardiovascular treatment",
      time: "1d ago"
    },
    {
      type: "collaboration",
      icon: Building2,
      action: "Partnership announced",
      content: "Research collaboration with Mayo Clinic",
      time: "2d ago"
    },
    {
      type: "event",
      icon: Calendar,
      action: "Hosting conference",
      content: "International Medical Summit 2025",
      time: "1w ago"
    }
  ];

  const handleShowMoreConnections = () => {
    router.push('/notifications?tab=connections');
  };

  const handleManageInstitute = () => {
    router.push('/settings?tab=institution');
  };

  const handleViewPublicProfile = () => {
    if (currentEntity?.id) {
      router.push(`/institute/${currentEntity.id}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Institution Management Card - Only show for own institution */}
      {isOwnInstitute && currentEntity && (
        <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Institution Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">{currentEntity?.name}</p>
              <p className="text-xs text-blue-600">
                {userType === 'institution' && 'type' in currentEntity! ? currentEntity.type : "Institution"}
              </p>
              {currentEntity?.location && (
                <p className="text-xs text-blue-600">{currentEntity.location}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={handleViewPublicProfile}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={handleManageInstitute}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Institution
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Connect with Professionals
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
            Trending in Institutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {instituteTrends.map((topic, index) => (
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
            Institutional Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentInstitutionalActivity.map((activity, index) => (
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
            Find institutions
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
