"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DoctorProfileCard } from "@/components/Index/ProfilePreview/DoctorProfileCard";
import { SectionHeading } from "@/components/Index/ProfilePreview/SectionHeading";

const doctors = [
  {
    value: "cardiologist",
    initials: "ec",
    name: "dr. elena cardoza",
    title: "interventional cardiologist",
    institution: "stanford medicine",
    experience: "15+ years experience",
    tags: ["#heartfailure", "#echocardiography", "#cardiacct"],
    work: [
      "stanford medicine - interventional cardiologist",
      "mayo clinic - cardiology fellow",
    ],
    stats: {
      connections: 512,
      publications: 32,
      events: 12,
    },
  },
  {
    value: "neurologist",
    initials: "rk",
    name: "dr. robert kim",
    title: "neurologist, stroke specialist",
    institution: "mass general hospital",
    experience: "10+ years experience",
    tags: ["#alzheimer", "#neuralpathways", "#strokeintervention"],
    work: [
      "mass general hospital - neurologist",
      "johns hopkins - neurology resident",
    ],
    stats: {
      connections: 425,
      publications: 28,
      events: 8,
    },
  },
  {
    value: "oncologist",
    initials: "jw",
    name: "dr. james wilson",
    title: "oncologist, cancer researcher",
    institution: "md anderson cancer center",
    experience: "20+ years experience",
    tags: ["#immunotherapy", "#oncologyresearch", "#cancertreatment"],
    work: [
      "md anderson - oncology research director",
      "memorial sloan kettering - oncology fellow",
    ],
    stats: {
      connections: 680,
      publications: 45,
      events: 15,
    },
  },
];

export function ProfilePreview() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="discover peers, build connections"
          subtitle="create your professional medical profile and connect with colleagues across institutions and specialties"
        />

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="cardiologist" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full">
              {doctors.map((doc) => (
                <TabsTrigger key={doc.value} value={doc.value}>
                  {doc.value}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -left-10 w-32 h-32 bg-medical-teal/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <motion.div
                className="absolute bottom-0 -right-10 w-32 h-32 bg-medical-blue/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
              />
              {doctors.map((doc) => (
                <TabsContent key={doc.value} value={doc.value}>
                  <DoctorProfileCard {...doc} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-medical-teal text-medical-teal hover:bg-medical-teal/5"
            >
              browse public profiles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
