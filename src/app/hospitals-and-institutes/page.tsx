import Features from "../medical-professionals/_sections/Features"
import QnA from "../medical-professionals/_sections/QNASesction"
import Categories from "./_sections/Categories"
import Hero from "./_sections/Hero"
import HireSteps from "./_sections/HireSteps"
import HospitalTestimonials from "./_sections/HospitalTestimonials"
import Insights from "./_sections/Insights"
import OperationalMarkets from "./_sections/OperationalMarkets"
import TrustedBy from "./_sections/TrustedBy"
import Footer from "../../components/navbar.tsx/Footer"
import Dashboard from "./_components/Dashboard"

const Page = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <Dashboard />
            <TrustedBy />
            <HireSteps />
            <Features />
            <Categories />
            <Insights />
            <OperationalMarkets />
            <HospitalTestimonials />
            <QnA />
            <Footer />
        </div>
    )
}

export default Page