import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Video } from "lucide-react";

export const ProfileResourcesCard = () => {
  return (
    <Card className="mb-6 rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Resources</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span className="text-gray-700">Research Papers</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="text-gray-700">Case Studies</span>
        </div>
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-blue-500" />
          <span className="text-gray-700">Webinars</span>
        </div>
      </CardContent>
    </Card>
  );
};
