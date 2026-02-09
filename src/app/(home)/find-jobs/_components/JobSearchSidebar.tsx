import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
}

const JobSearchSidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const router = useRouter();
  return (
    <div className={`w-80 sticky top-0 h-screen flex-shrink-0 ${className}`}>
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-6 space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Application Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Pending Review</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">8</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">Interview Scheduled</span>
                  </div>
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">3</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">Not Selected</span>
                  </div>
                  <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">1</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => router.push('/find-jobs/applied')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  View All Applications →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-orange-700 text-lg">📄</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Update CV</div>
                    <div className="text-xs text-orange-700 font-medium">Last updated 2 weeks ago</div>
                  </div>
                  <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </div>
                
                <div 
                  onClick={() => router.push('/saved-jobs')}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-blue-700 text-lg">🔖</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">View Saved Jobs</div>
                    <div className="text-xs text-blue-700 font-medium">5 jobs saved</div>
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-yellow-700 text-lg">🔔</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Job Alerts</div>
                    <div className="text-xs text-yellow-700 font-medium">Set up personalized alerts</div>
                  </div>
                  <div className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-purple-700 text-lg">💬</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Messages</div>
                    <div className="text-xs text-purple-700 font-medium">2 new from recruiters</div>
                  </div>
                  <Badge className="bg-purple-500 text-white text-xs px-2 py-1">2</Badge>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Application Update</div>
                      <div className="text-xs text-gray-700 mb-2">Google invited you for an interview</div>
                      <div className="text-xs text-green-600 font-medium">2 hours ago</div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border-l-4 border-blue-500 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Job Match</div>
                      <div className="text-xs text-gray-700 mb-2">3 new jobs match your preferences</div>
                      <div className="text-xs text-blue-600 font-medium">1 day ago</div>
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">3</Badge>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-500 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Profile View</div>
                      <div className="text-xs text-gray-700 mb-2">Your profile was viewed 5 times</div>
                      <div className="text-xs text-yellow-600 font-medium">3 days ago</div>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">5</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Market Insights */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-indigo-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Job Market Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                  <div>
                    <div className="text-sm font-bold text-gray-900">Healthcare Jobs</div>
                    <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <span>+15% this month</span>
                      <span className="text-green-500">↗️</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    1,247
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                  <div>
                    <div className="text-sm font-bold text-gray-900">Remote Positions</div>
                    <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <span>+28% this month</span>
                      <span className="text-green-500">↗️</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    892
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-white px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
                    View Full Report →
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended for You */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Job Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all cursor-pointer bg-gradient-to-r from-white to-green-50">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Healthcare Data Analyst</div>
                  <div className="text-xs text-gray-600 mb-2">Apollo Hospitals • Mumbai</div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800 text-xs font-bold">95% match</Badge>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-gradient-to-r from-white to-blue-50">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Medical Research Coordinator</div>
                  <div className="text-xs text-gray-600 mb-2">AIIMS • Delhi</div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800 text-xs font-bold">88% match</Badge>
                    <span className="text-xs text-gray-500">5h ago</span>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <button className="text-xs text-pink-600 hover:text-pink-800 font-bold hover:underline">
                    See All Recommendations →
                  </button>
                </div>
              </div>
            </div>

            {/* Career Resources */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                Career Resources
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center gap-2 p-3 hover:bg-pink-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-pink-600 text-sm">📚</span>
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Interview Tips</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-green-600 text-sm">💼</span>
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Resume Builder</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-indigo-600 text-sm">📈</span>
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Salary Insights</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-3 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-orange-600 text-sm">🎯</span>
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Career Guidance</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-600 mb-2">Need help finding the right job?</div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
                Get Career Guidance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchSidebar;
