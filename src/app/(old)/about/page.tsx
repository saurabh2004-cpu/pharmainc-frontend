import React from "react";
import { 
  Users, Award, Globe, Heart, Shield,
  Target, Lightbulb, BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LandingNavbar from "../_components/LandingNavbar";
import Footer from "../_components/Footer";

const About = () => {
  const stats = [
    { label: "Medical Professionals", value: "50,000+", icon: Users, color: "text-blue-600" },
    { label: "Research Papers", value: "25,000+", icon: BookOpen, color: "text-green-600" },
    { label: "Medical Societies", value: "500+", icon: Award, color: "text-purple-600" },
    { label: "Countries Served", value: "120+", icon: Globe, color: "text-orange-600" }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      specialty: "Cardiology",
      image: "https://i.pravatar.cc/300?img=1",
      bio: "Leading cardiovascular surgeon with 15+ years of experience in medical technology innovation."
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Head of Research",
      specialty: "Neurology",
      image: "https://i.pravatar.cc/300?img=3",
      bio: "Renowned neurologist and researcher, specializing in AI applications in medical diagnostics."
    },
    {
      name: "Dr. Lisa Wang",
      role: "Director of Education",
      specialty: "Pediatrics",
      image: "https://i.pravatar.cc/300?img=5",
      bio: "Passionate educator and pediatrician dedicated to advancing medical education globally."
    },
    {
      name: "Dr. Robert Kim",
      role: "Innovation Lead",
      specialty: "Emergency Medicine",
      image: "https://i.pravatar.cc/300?img=7",
      bio: "Emergency medicine specialist focused on developing life-saving medical technologies."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Everything we do is driven by our commitment to improving patient outcomes and healthcare quality worldwide."
    },
    {
      icon: Shield,
      title: "Data Privacy & Security",
      description: "We maintain the highest standards of data protection and privacy, ensuring all medical information is secure."
    },
    {
      icon: Lightbulb,
      title: "Innovation & Excellence",
      description: "We continuously push the boundaries of medical technology to provide cutting-edge solutions for healthcare professionals."
    },
    {
      icon: Target,
      title: "Global Accessibility",
      description: "Our mission is to make advanced medical knowledge and resources accessible to healthcare professionals everywhere."
    }
  ];

  const milestones = [
    { year: "2018", title: "Platform Launch", description: "PharmInc was founded with a vision to connect medical professionals globally" },
    { year: "2019", title: "10,000 Users", description: "Reached our first major milestone of 10,000 registered medical professionals" },
    { year: "2020", title: "Global Expansion", description: "Expanded operations to serve healthcare professionals in over 50 countries" },
    { year: "2021", title: "Research Hub", description: "Launched our comprehensive research platform with peer-reviewed publications" },
    { year: "2022", title: "AI Integration", description: "Introduced AI-powered diagnostic tools and research assistance features" },
    { year: "2023", title: "50,000 Members", description: "Celebrated reaching 50,000+ medical professionals on our platform" },
    { year: "2024", title: "Future Vision", description: "Continuing to innovate and expand our impact on global healthcare" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About PharmInc
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Empowering healthcare professionals worldwide through innovative technology, collaborative research, and continuous education
          </p>
          
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Join Our Mission
            </Button>
            <Button variant="outline" className="border-white text-blue hover:bg-white hover:text-blue-600 px-8 py-3">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To revolutionize healthcare by creating a global platform that connects medical professionals, 
                facilitates knowledge sharing, and accelerates medical research and innovation. We believe that 
                by bringing together the brightest minds in medicine, we can solve the world's most pressing 
                healthcare challenges.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Advance medical research through collaboration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Improve patient outcomes worldwide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Foster innovation in healthcare technology</span>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop"
                alt="Medical professionals collaborating"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do and shape our commitment to the medical community
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our diverse team of medical professionals and technology experts working together to transform healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                    <Badge className="bg-blue-100 text-blue-700 mb-3">{member.specialty}</Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a small startup to a global platform serving thousands of medical professionals
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                      {milestone.year}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of the global movement transforming healthcare through collaboration and innovation
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
