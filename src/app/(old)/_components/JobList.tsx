import { useEffect, useState } from "react";
import JobCard from "./JobCard";

interface ApiJob {
  id: string;
  title: string;
  description: string;
  payRange: string;
  benefits: string;
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  instituteId: string;
  instituteName: string;
  instituteLocation: string;
}

interface DisplayJob {
  jobTitle: string;
  location: string;
  hospital: string;
  tags: string[];
}

const JobList = () => {
  const [jobs, setJobs] = useState<DisplayJob[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
      //   const response = await jobApiClient.get<ApiJob[]>("/public/job");
      //   // Map the API response to the format expected by your JobCard
      //   const mappedJobs = response.map((job) => ({
      //     jobTitle: job.title,
      //     location: job.location,
      //     hospital: job.instituteName,
      //     tags: [
      //       // Split benefits into individual tags
      //       ...(job.benefits ? job.benefits.split(", ") : []),
      //       // Add category as a tag (optional)
      //       job.category,
      //     ],
      //   })
      // );
      //   setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 flex flex-col bg-[#f3f7fb] rounded-2xl border border-[#e1e9f2] mt-10 shadow-sm">
      <h2 className="text-xl font-extrabold text-[#23497d] mb-4">
        Featured Doctor Jobs in India
      </h2>
      {jobs.map((job, idx) => (
        <JobCard
          key={idx}
          jobTitle={job.jobTitle + " - " + job.hospital}
          location={job.location}
          hospital={job.hospital}
          tags={job.tags}
        />
      ))}
    </section>
  );
};

export default JobList;
