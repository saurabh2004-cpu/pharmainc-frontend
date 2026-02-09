import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const filters = [
  { name: "Location", placeholder: "All locations" },
  { name: "Experience", placeholder: "Any experience" },
  { name: "Job Type", placeholder: "All job types" },
];

const HeroSection = () => (
  <section className="w-full bg-[#e9f1fb] pt-10 pb-10 lg:py-16 border-b">
    <div className="max-w-3xl mx-auto px-4 text-center flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#23497d]">
        <br></br>
        Find Your Perfect Healthcare Job
      </h1>
      <p className="text-base md:text-lg text-[#5471a6]">
        Connect with top institutions offering roles for doctors, nurses, and more.
      </p>
      {/* Search & filters */}
      <form className="flex flex-col md:flex-row gap-3 justify-center mt-2">
        <div className="relative flex-1 min-w-[200px] md:w-[260px]">
          <Input
            className="pl-10 rounded-md bg-white shadow focus:ring-2 focus:ring-blue-200"
            placeholder="Search by specialty, city (e.g., Mumbai)"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75a5e9]" />
        </div>
        {filters.map((filter) => (
          <Input
            key={filter.name}
            className="md:w-[160px] rounded-md bg-white shadow"
            placeholder={filter.placeholder}
            aria-label={filter.name}
          />
        ))}
        <Button className="md:ml-2 mt-1 md:mt-0 bg-[#2763ed] hover:bg-[#1e51c3] font-bold rounded-md shadow text-white px-6">
          Search
        </Button>
      </form>
    </div>
  </section>
);

export default HeroSection;