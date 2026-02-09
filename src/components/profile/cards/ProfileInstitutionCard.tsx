import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Institution } from "@/lib/api";

interface ProfileInstitutionCardProps {
  institution: Institution | null;
}

export const ProfileInstitutionCard = ({
  institution,
}: ProfileInstitutionCardProps) => {
  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Institution</CardTitle>
      </CardHeader>
      <CardContent>
        {institution ? (
          <div>
            <div className="font-semibold text-base">{institution.name}</div>
            <div className="text-sm text-gray-600">{institution.location}</div>
          </div>
        ) : (
          <div>No institution found.</div>
        )}
      </CardContent>
    </Card>
  );
};
