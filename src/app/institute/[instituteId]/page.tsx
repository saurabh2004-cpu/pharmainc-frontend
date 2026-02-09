import { getInstitutionById, Institution } from "@/lib/api";
import { InstitutionProfileClient } from "./InstitutionProfileClient";

export default async function InstitutionProfilePage({
  params,
}: {
  params: Promise<{ instituteId: string }>;
}) {
  const { instituteId } = await params;
  
  try {
    const institutionData = await getInstitutionById(instituteId);
    return <InstitutionProfileClient institutionData={institutionData} instituteId={instituteId} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-700">Institution not found</div>
      </div>
    );
  }
}
