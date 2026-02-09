import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, Calendar } from "lucide-react";

export const ProfileActivityTab = () => {
  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="px-2 py-1">
              <Edit className="h-3 w-3 mr-1" />
              <span>Posted</span>
            </Badge>
            <div>
              <h4 className="font-semibold text-base">
                Published a new article
              </h4>
              <p className="text-sm text-gray-600">
                Shared insights on the latest trends in cardiology.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="px-2 py-1">
              <Users className="h-3 w-3 mr-1" />
              <span>Joined</span>
            </Badge>
            <div>
              <h4 className="font-semibold text-base">
                Joined Cardiology Group
              </h4>
              <p className="text-sm text-gray-600">
                Became a member of the Cardiology Network.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="px-2 py-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Attended</span>
            </Badge>
            <div>
              <h4 className="font-semibold text-base">Attended Webinar</h4>
              <p className="text-sm text-gray-600">
                Participated in a session on AI in Pharma.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
