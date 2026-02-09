import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ProfileTrendingTagsCard = () => {
  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Trending Tags</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="px-3 py-1">
          Cardiology
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          Pharmacy
        </Badge>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Research
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            AI
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
