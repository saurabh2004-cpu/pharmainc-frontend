import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, FilePlus } from "lucide-react";
import Link from "next/link";

const JobsLanding = () => {
  return (
    <section className="w-full flex-grow py-16 md:py-24 lg:py-32 bg-[#f3f7fb]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#23497d]">
            Welcome to the PharmInc Job Portal
          </h1>
          <p className="text-base md:text-lg text-[#5471a6] mt-2">
            Your next career move or your next star employee is just a click away.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Link href="/find-jobs" className="no-underline">
            <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow bg-white rounded-2xl border border-[#e1e9f2] p-6 text-center">
              <CardHeader className="p-0">
                <List className="w-12 h-12 text-[#2763ed] mb-4 mx-auto" />
                <CardTitle className="text-[#23497d] text-2xl font-bold">I'm Looking for Jobs</CardTitle>
                <CardDescription className="text-[#5471a6] mt-2">Browse and apply to the best healthcare jobs in India.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-0 pt-6">
                <Button className="bg-[#2763ed] hover:bg-[#1e51c3] font-bold rounded-md shadow text-white px-8">Find Jobs</Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/post-job" className="no-underline">
            <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow bg-white rounded-2xl border border-[#e1e9f2] p-6 text-center">
              <CardHeader className="p-0">
                <FilePlus className="w-12 h-12 text-[#2763ed] mb-4 mx-auto" />
                <CardTitle className="text-[#23497d] text-2xl font-bold">I Want to Post a Job</CardTitle>
                <CardDescription className="text-[#5471a6] mt-2">Recruit top talent by posting your job openings.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-0 pt-6">
                <Button className="bg-[#2763ed] hover:bg-[#1e51c3] font-bold rounded-md shadow text-white px-8">Post a Job</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobsLanding;
