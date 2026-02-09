import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type JobCardProps = {
  jobTitle: string;
  location: string;
  hospital: string;
  tags: string[];
};

const JobCard = ({ jobTitle, location, hospital, tags }: JobCardProps) => (
  <div className="flex items-center justify-between bg-white border border-[hsl(215,34%,90%)] rounded-lg shadow-xs px-5 py-4 hover:shadow-md transition-shadow mb-4">
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold text-[#23497d] truncate text-base md:text-lg">{jobTitle}</span>
        <span className="inline-block text-xs text-[#5471a6] truncate">
          – {hospital}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <span className="text-xs text-[#75a5e9] bg-[#eef5fb] px-2 py-0.5 rounded">{location}</span>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium px-2 py-0.5 bg-[#e9f1fb] text-[#23497d]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    <div className="ml-4 flex-shrink-0">
      <Button 
        size="sm" 
        className="font-bold px-5 rounded-md bg-[#2763ed] hover:bg-[#1e51c3] text-white transition-colors"
      >
        Apply
      </Button>
    </div>
  </div>
);

export default JobCard;