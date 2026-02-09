import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, Calendar } from "lucide-react";

export const ProfileActivityCard = () => {
  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-start gap-2">
          <Badge variant="secondary" className="px-2 py-1">
            <Edit className="h-3 w-3 mr-1" />
            <span>Posted</span>
          </Badge>
          <span className="text-gray-700">New research on cardiology</span>
        </div>
        <div className="flex items-start gap-2">
          <Badge variant="secondary" className="px-2 py-1">
            <Users className="h-3 w-3 mr-1" />
            <span>Joined</span>
          </Badge>
          <span className="text-gray-700">Cardiology Group</span>
        </div>
        <div className="flex items-start gap-2">
          <Badge variant="secondary" className="px-2 py-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Attended</span>
          </Badge>
          <span className="text-gray-700">Webinar on AI in Pharma</span>
        </div>
      </CardContent>
    </Card>
  );
};
