import { motion } from "framer-motion";
import { User, Building, MessageSquare, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DoctorProfileCard({
  initials,
  name,
  title,
  institution,
  experience,
  tags,
  work,
  stats,
}: {
  initials: string;
  name: string;
  title: string;
  institution: string;
  experience: string;
  tags: string[];
  work: string[];
  stats: { connections: number; publications: number; events: number };
}) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-32 bg-gradient-to-r from-medical-blue to-medical-teal"></div>
      <div className="p-6 pt-0 relative">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-medical-light-blue absolute -mt-12 flex items-center justify-center">
          <span className="text-medical-blue font-bold text-xl">{initials}</span>
        </div>
        <div className="ml-28">
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-gray-600">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="px-2 py-0.5 text-xs bg-medical-light-blue text-medical-blue rounded-full">{institution}</div>
            <div className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{experience}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag} className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-full">{tag}</div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-medical-blue" />
              <span>work experience</span>
            </h4>
            <ul className="text-sm space-y-2">
              {work.map((w) => (
                <li key={w} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-medical-blue shrink-0"></div>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-gray-50">
              <User className="w-5 h-5 mx-auto mb-1 text-medical-blue" />
              <p className="text-sm font-medium">{stats.connections} connections</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <MessageSquare className="w-5 h-5 mx-auto mb-1 text-medical-blue" />
              <p className="text-sm font-medium">{stats.publications} publications</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-medical-blue" />
              <p className="text-sm font-medium">{stats.events} events</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline" size="sm" className="gap-1">
            <Heart className="w-4 h-4" /> follow
          </Button>
          <Button size="sm">view full profile</Button>
        </div>
      </div>
    </motion.div>
  );
}