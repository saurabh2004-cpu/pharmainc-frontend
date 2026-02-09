import Link from "next/link";
import {
  Home,
  Search,
  MessageCircle,
  FileText,
  Bell,
  Network,
} from "lucide-react";
import { BiLogOut } from "react-icons/bi";
import { User } from "./types";

interface LeftSidebarProps {
  user: User;
  handleLogout: () => void;
}

export default function LeftSidebar({ user, handleLogout }: LeftSidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 md:w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col p-2 md:p-3 z-40">
      {/* Logo */}
      <div className="w-full h-10 md:h-14 flex items-center justify-center border-b border-gray-200">
        <img src="/logo.png" alt="Logo" className="h-8 md:h-10" />
      </div>

      {/* Profile Card */}
      <Link href="/profile" className="mt-1 md:mt-3">
        <div className="relative w-full bg-white rounded-xl shadow-sm border border-gray-100 mb-2 md:mb-3 cursor-pointer">
          <div className="w-full h-12 md:h-16 bg-gray-200 rounded-t-xl overflow-hidden">
            <img src="/banner.png" alt="Profile Banner" className="w-full h-full object-cover" />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[48px] md:top-[64px] z-10">
            <img
              src={user?.profilePicture || "/pp.png"}
              alt="Profile"
              className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white shadow-lg object-cover"
            />
          </div>
          <div className="pt-8 md:pt-10 pb-2 flex flex-col items-center px-2">
            <div className="flex items-center gap-1">
              <h2 className="text-sm md:text-base font-bold text-gray-900 truncate">{user?.name}</h2>
              <span className="text-xs text-gray-500">• Online</span>
            </div>
            <div className="text-blue-700 text-xs font-medium mt-0.5 truncate">
              {user?.speciality || "Doctor"}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5 truncate">
              {user?.location || "Delhi, India"}
            </div>
            <div className="flex flex-wrap gap-1 mt-1 justify-center">
              {user?.roles?.map((role, index) => (
                <span key={index} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full text-gray-700">
                  {role}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded-full">
                Connect
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full">
                Message
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation and Logout */}
      <nav className="flex flex-col gap-0.5">
        <Link href="/" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <Search className="h-4 w-4" />
          <span>Explore</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <MessageCircle className="h-4 w-4" />
          <span>Messages</span>
        </Link>
        <Link href="/jobs" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <FileText className="h-4 w-4" />
          <span>Jobs</span>
        </Link>
        <Link href="/notifications" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </Link>
        <Link href="/societies" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-xs md:text-sm text-gray-700">
          <Network className="h-4 w-4" />
          <span>Societies</span>
        </Link>
        {/* Logout immediately below societies */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-50 text-xs md:text-sm text-red-600 w-full mt-1"
        >
          <BiLogOut />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
