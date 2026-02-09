import { 
  Users, Calendar, MapPin, Star, Crown,
  MessageSquare, TrendingUp, BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LandingNavbar from "../_components/LandingNavbar";
import Footer from "../_components/Footer";

const Societies = () => {
  const featuredSocieties = [
    {
      id: 1,
      name: "Indian Medical Association (IMA)",
      description: "India's largest organization of doctors of modern medicine, advocating for medical professionals and community health.",
      members: 350000,
      category: "General Medicine",
      location: "Pan-India",
      founded: "1928",
      image: "/ima.png", // Official vector logo from brandsoftheworld[5]
      features: ["Continuing Medical Education", "Legal Support", "Community Health Initiatives", "Annual Conferences"],
      rating: 4.8,
      isVerified: true
    },
    {
      id: 2,
      name: "Indian Academy of Pediatrics (IAP)",
      description: "Leading association of pediatricians in India, dedicated to improving child health and advancing pediatric science.",
      members: 23000,
      category: "Pediatrics",
      location: "Pan-India",
      founded: "1963",
      image: "/iap.png", // Official logo from IAP website
      features: ["Pediatric Training", "Research Collaboration", "Child Health Advocacy", "Mentorship Programs"],
      rating: 4.7,
      isVerified: true
    },
    {
      id: 3,
      name: "Cardiological Society of India (CSI)",
      description: "Premier organization of cardiologists in India, focused on prevention and management of cardiovascular diseases.",
      members: 5400,
      category: "Cardiology",
      location: "Pan-India",
      founded: "1948",
      image: "https://www.csiindia.org/wp-content/uploads/2020/04/csi-logo.png", // Official logo from CSI website[3]
      features: ["Interventional Cardiology Workshops", "Annual Conferences", "Research Database", "Guidelines Development"],
      rating: 4.6,
      isVerified: true
    },
    {
      id: 4,
      name: "Neurological Society of India (NSI)",
      description: "Apex body for neurologists and neurosurgeons in India, promoting research, education, and standards in neurology.",
      members: 2000,
      category: "Neurology",
      location: "Pan-India",
      founded: "1951",
      image: "https://www.neurosi.org/images/logo.jpg", // Official logo from NSI website[4]
      features: ["Research Collaboration", "Annual Conferences", "Postgraduate Education", "Public Awareness Campaigns"],
      rating: 4.5,
      isVerified: true
    }
  ];

  const categories = [
    { name: "General Medicine", count: 35, color: "bg-red-100 text-red-700" },
    { name: "Neurology", count: 18, color: "bg-blue-100 text-blue-700" },
    { name: "Pediatrics", count: 22, color: "bg-green-100 text-green-700" },
    { name: "Cardiology", count: 17, color: "bg-orange-100 text-orange-700" },
    { name: "Oncology", count: 11, color: "bg-purple-100 text-purple-700" },
    { name: "Emergency Medicine", count: 8, color: "bg-gray-100 text-gray-700" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "IMA NATCON 2024",
      society: "Indian Medical Association",
      date: "December 27-28, 2024",
      location: "Hyderabad, Telangana",
      attendees: 5000,
      type: "Conference"
    },
    {
      id: 2,
      title: "Pediatric Innovation Workshop",
      society: "Indian Academy of Pediatrics",
      date: "December 11-12, 2024",
      location: "Chennai, Tamil Nadu",
      attendees: 850,
      type: "Workshop"
    },
    {
      id: 3,
      title: "EMCON 2025",
      society: "Society for Emergency Medicine India",
      date: "November 1-3, 2025",
      location: "New Delhi",
      attendees: 1200,
      type: "Symposium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Indian Medical Societies & Organizations
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect with India's top medical societies, access exclusive resources, and advance your professional development
          </p>
          
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Browse Societies
            </Button>
            <Button variant="outline" className="border-blue text-blue hover:bg-white hover:text-blue-600 px-8 py-3">
              Create Society
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <aside className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Society Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <Badge className={`${category.color} text-xs`}>
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{event.society}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{event.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.attendees} attending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Indian Medical Societies</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Most Popular
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {featuredSocieties.map((society) => (
                <div key={society.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={society.image} 
                          alt={society.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            {society.name}
                            {society.isVerified && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {society.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{society.rating}</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {society.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {society.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {society.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {society.members.toLocaleString()} members
                        </span>
                        <span>Founded {society.founded}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Join Society
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                View All Societies
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Societies;
