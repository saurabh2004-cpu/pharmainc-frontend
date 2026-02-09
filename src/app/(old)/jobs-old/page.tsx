
import Navbar from "../_components/Navbar";
import JobsLanding from "../_components/JobsLanding";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Navbar />
      <JobsLanding />
    </div>
  );
};

export default Index;