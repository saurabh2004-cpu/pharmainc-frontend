import Features from "../medical-professionals/_sections/Features"
import QnA from "../medical-professionals/_sections/QNASesction"
import Categories from "./_sections/Categories"
import Hero from "./_sections/Hero"
import HireSteps from "./_sections/HireSteps"
import HospitalTestimonials from "./_sections/HospitalTestimonials"
import Insights from "./_sections/Insights"
import OperationalMarkets from "./_sections/OperationalMarkets"
import TrustedBy from "./_sections/TrustedBy"
import Footer from "../../components/hospitals-and-professionsla/Footer"
import Dashboard from "./_components/Dashboard"

const Page = () => {
    const features = [
        {
            id: 1,
            title: 'Workforce Visibility',
            description: `Gain clearer oversight into candidate availability, hiring
                    progress, and workforce requirements across departments`,
            image: '/hospitals-and-institutes/slide-1.png',
        },
        {
            id: 2,
            title: 'Faster Hiring Coordination',
            description: `Simplify shortlisting, communication, and interview
                        scheduling through one centralized workflow`,
            image: '/hospitals-and-institutes/slide-2.png'
        },
        {
            id: 3,
            title: 'Scalable Workforce Access',
            description: `Access healthcare professionals across multiple
                        specialties, locations, and staffing requirements.`,
            image: '/hospitals-and-institutes/slide-3.png',
        },
        {
            id: 4,
            title: 'Streamlined Recruitment Operations',
            description: `Reduce administrative friction through a more organized
                        and efficient hiring process.`,
            image: '/hospitals-and-institutes/slide-4.png',
        }, 
    ];

    const faqItems = [
        {
            id: 1,
            question: 'How do healthcare institutions post workforce requirements on PharmInc?',
            answer: 'Hospitals and clinics can post jobs by logging into their account, navigating to the job posting section, filling in the required details including position, qualifications, and location, and then submitting for approval. The process typically takes 24–48 hours for review.',
        },
        {
            id: 2,
            question: 'Is the platform designed for different types of healthcare institutions?',
            answer: 'The same process applies to all healthcare institutions. Our platform provides templates and guided steps to make posting jobs quick and efficient. Support is available 24/7 if you need assistance.',
        },
        {
            id: 3,
            question: 'How are applications and candidate responses managed?',
            answer: 'Job postings are visible to qualified candidates immediately after approval. You can manage postings, view applications, and communicate with candidates through the dashboard.',
        },
        {
            id: 4,
            question: 'Can hiring requirements be customized for specific workforce needs?',
            answer: 'The platform supports multiple languages and formats. You can also set specific requirements, salary ranges, and preferred qualifications for better candidate matching.',
        },
        {
            id: 5,
            question: 'Does PharmInc offer advanced hiring and visibility features?',
            answer: 'Premium features include featured job listings, priority candidate matching, and advanced analytics. Contact our sales team to learn more about available plans.',
        },
    ];

    const footerHeading = "Build Your Healthcare Hiring Network"
    const footerSubHeading = "Start onboarding your institution onto PharmInc and access a more direct approach to healthcare hiring.Request Platform Access"
    const FooterButtonText = "Request Platform Access"
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <Dashboard />
            <TrustedBy />
            <HireSteps />
            <Features features={features} heading="Why Healthcare Institutions Choose PharmInc" />
            <Categories />
            <Insights />
            <OperationalMarkets />
            <HospitalTestimonials />
            <QnA faqItems={faqItems} />
            <Footer footerHeading={footerHeading} footerSubHeading={footerSubHeading} FooterButtonText={FooterButtonText} />
        </div>
    )
}

export default Page