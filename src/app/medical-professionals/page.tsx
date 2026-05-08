import Hero from "./_sections/hero"
import DashboardPreview from "./_components/dashboard-preview"
import RecruitmentProcess from "./_sections/RecruitmentProcess"
import Features from "./_sections/Features"
import Jobs from "./_sections/Jobs"
import JobSuccess from "./_sections/JobsSuccess"
import Testimonials from "./_sections/TestimonialsCarousel"
import Stats from "./_sections/Stats"
import QnA from "./_sections/QNASesction"
import Footer from "../../components/hospitals-and-professionsla/Footer"


const Page = () => {



    const features = [
        {
            id: 1,
            title: 'Verified Opportunities',
            description: `Apply only to verified hospitals, clinics, and healthcare institutions.`,
            image: '/medical-professionals/slide-1.png',
        },
        {
            id: 2,
            title: 'Direct Hiring Access',
            description: `Connect directly with recruiters without agency involvement.`,
            image: '/medical-professionals/slide-2.png',
        },
        {
            id: 3,
            title: 'Career Flexibility',
            description: `Explore full-time, part-time, remote, and shift-based opportunities.`,
            image: '/medical-professionals/slide-3.png',
        },
        {
            id: 4,
            title: 'Faster Application Process',
            description: `Track interviews, applications, and hiring progress from one dashboard.`,
            image: '/medical-professionals/slide-4.png',
        },
    ];

    const faqItems = [
        {
            id: 1,
            question: 'How do I apply for opportunities on PharmInc?',
            answer: `Create your professional profile, upload your credentials and resume, and start exploring verified healthcare opportunities that match your specialty, experience, and preferred location. Applications can be submitted directly through the platform.`,
        },
        {
            id: 2,
            question: 'Are hospitals and institutions verified?',
            answer: `Yes. Institutions on PharmInc go through a verification process before being listed on the platform to help healthcare professionals connect with trusted hospitals, clinics, and healthcare organizations.`,
        },
        {
            id: 3,
            question: 'Can I apply for multiple roles at once?',
            answer: `Yes. You can explore and apply for multiple healthcare opportunities across different institutions, specialties, and locations based on your qualifications and preferences.`,
        },
    ];

    const footerHeading = "Take Control of Your Healthcare Career"
    const footerSubHeading = `Join PharmInc to discover verified opportunities, connect directly with healthcare institutions, and grow your career without agency dependency.`
    const FooterButtonText = "Create Your Profile"

    return (
        <div className="flex flex-col bg-[#c6f7dd] min-h-screen">
            <Hero />
            <DashboardPreview />
            <RecruitmentProcess />
            <Features features={features} heading={"Why Choose Our Platform"} />
            {/* <Jobs /> */}
            {/* <JobSuccess /> */}
            <Testimonials />
            <Stats />
            <QnA faqItems={faqItems} />
            <Footer footerHeading={footerHeading} footerSubHeading={footerSubHeading} FooterButtonText={FooterButtonText} />
        </div>
    )
}

export default Page