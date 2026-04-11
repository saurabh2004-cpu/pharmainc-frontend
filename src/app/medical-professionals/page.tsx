import Hero from "./_sections/hero"
import DashboardPreview from "./_components/dashboard-preview"
import RecruitmentProcess from "./_sections/RecruitmentProcess"
import Features from "./_sections/Features"
import Jobs from "./_sections/Jobs"
import JobSuccess from "./_sections/JobsSuccess"
import Testimonials from "./_sections/TestimonialsCarousel"
import Stats from "./_sections/Stats"
import QnA from "./_sections/QNASesction"
import Footer from "../../components/userAndProfessionals/Footer"


const Page = () => {
    return (
        <div className="flex flex-col bg-[#c6f7dd] min-h-screen">
            <Hero />
            <DashboardPreview />
            <RecruitmentProcess />
            <Features />
            {/* <Jobs /> */}
            <JobSuccess />
            <Testimonials />
            <Stats />
            <QnA />
            <Footer />
        </div>
    )
}

export default Page