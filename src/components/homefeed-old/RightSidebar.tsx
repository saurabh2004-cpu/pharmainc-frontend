import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const rightSidebarData = [
  {
    section: "Journal Club",
    items: [
      {
        title: "AI in Clinical Diagnosis",
        doctors: 28,
        desc: "Latest paper from NEJM on machine learning applications",
        time: "Today at 2 PM",
      },
      {
        title: "Ethics Lab Case 003",
        doctors: 24,
        desc: "Ethical implications of genetic testing in pediatrics",
        time: "Tomorrow at 3 PM",
      },
    ],
  },
  {
    section: "Featured Conferences",
    items: [
      {
        title: "Global Health Summit 2024",
        date: "March 15-17, 2024 • Boston, MA",
        cme: 32,
        mode: "In-Person",
      },
    ],
  },
  {
    section: "Upcoming Events",
    items: [
      {
        month: "OCT",
        day: "15",
        title: "Advanced Cardiac Imaging Workshop",
        time: "10:00 AM - 4:00 PM",
        location: "Mayo Clinic, Rochester",
        cme: 6,
        spots: 8,
      },
      {
        month: "OCT",
        day: "18",
        title: "Research Methodology Seminar",
        time: "2:00 PM - 5:00 PM EST",
        location: "Virtual Event",
        cme: 0,
        spots: null,
      },
    ],
  },
];

export function RightSidebar() {
  return (
    <aside
      className="w-72 flex-shrink-0 bg-white border-l border-gray-200 p-4"
      style={{ position: "sticky", top: "1.8rem", alignSelf: "flex-start", height: "fit-content" }}
    >
      <div className="flex flex-col gap-4">
        {/* Journal Club */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm text-gray-900">Journal Club</h3>
            <Link href="#" className="text-xs text-blue-600 hover:underline">
              See all
            </Link>
          </div>
          {rightSidebarData[0].items.map((item, idx) => (
            <div key={idx} className="mb-3 pb-3 border-b border-gray-100">
              <h4 className="font-medium text-xs text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{item.desc}</p>
              <p className="text-xs text-gray-500 mb-2">{item.doctors} doctors discussing</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-6 text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50 px-2 py-0">
                  Join Discussion
                </Button>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Conferences */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm text-gray-900">Featured Conferences</h3>
            <Link href="#" className="text-xs text-blue-600 hover:underline">
              More
            </Link>
          </div>
          {rightSidebarData[1].items.map((item, idx) => (
            <div key={idx} className="mb-3 pb-3 border-b border-gray-100">
              <h4 className="font-medium text-xs text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{item.date}</p>
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-green-50 border border-green-200 text-green-700 rounded px-2">
                  {item.mode}
                </span>
                <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded px-2">
                  CME: {item.cme}
                </span>
              </div>
              <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm">
                Register Now
              </Button>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm text-gray-900">Upcoming Events</h3>
            <Link href="#" className="text-xs text-blue-600 hover:underline">
              See all
            </Link>
          </div>
          {rightSidebarData[2].items.map((event, idx) => (
            <div key={idx} className="flex gap-2 mb-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 text-center min-w-10 shadow-sm border border-blue-200">
                <span className="block text-xs text-blue-600 font-medium">{event.month}</span>
                <span className="block text-sm font-bold text-blue-700">{event.day}</span>
              </div>
              <div>
                <h4 className="font-medium text-xs text-gray-900 mb-1">{event.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{event.time}</p>
                <p className="text-xs text-gray-500">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
