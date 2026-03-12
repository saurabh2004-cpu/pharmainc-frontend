"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  MessageCircle,
  FileText,
  Bell,
  Network,
  Bookmark,
  Crown,
  User as UserIcon,
  Users,
  LogOut,
  Settings,
  BarChart3,
  CheckCircle,
  Plus,
  PlusCircle,
} from "lucide-react";
import { User, InstitutionEntity } from "../app/(home)/home/_components/types";
import Logo from "@/components/logo";
import { useUserStore, useInstitutionStore, useConnectionsStore, useNotificationStore } from "@/store";
import { useChatStore } from "@/store/chatStore";
import { UserAvatar } from "./UserAvatar";
import { clearAuthToken, getUserType } from "@/lib/api/utils";
import { getDisplayHandle, getProfilePicture } from "../app/(home)/home/_utils/utils";
import { BETA_BUILD_VERSION } from "@/config/constants";
import ShortLogo from "./ShortLogo";
import { useCurrentEntity } from "@/lib/utils/entityUtils";

interface LeftSidebarProps {
  user?: User | InstitutionEntity | null;
}

const navigations = [
  { href: '/dashboard', icon: BarChart3, label: 'Dashboard', userTypes: ['HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'] },
  { href: '/home', icon: Home, label: 'Home', userTypes: ['STUDENT', 'DOCTOR', 'NURSE', "OTHER"] },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/dashboard/posted-jobs', icon: FileText, label: 'Posted Jobs', userTypes: ['HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'] },
  // { href: '/dashboard/post-job', icon: FileText, label: 'Post Job', userTypes: ['HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'] },
  { href: '/my-networks', icon: Users, label: 'My Networks', userTypes: [''] },
  { href: '/find-jobs/bookmarks', icon: Bookmark, label: 'Bookmarks', userTypes: ['STUDENT', 'DOCTOR', 'NURSE', "OTHER"] },
  {
    href: '/find-jobs', icon: FileText, label: 'Jobs', userTypes: ['STUDENT', 'DOCTOR', 'NURSE', "OTHER"],
    subheadings: [
      { href: '/find-jobs/applied', icon: CheckCircle, label: 'Applied Jobs', userTypes: ['STUDENT', 'DOCTOR', 'NURSE', "OTHER"] },
      // { href: '/find-jobs/saved-jobs', icon: Bookmark, label: 'Saved Jobs', userTypes: ['STUDENT', 'DOCTOR', 'NURSE', "OTHER"] }
    ]
  },
  // { href: '/societies', icon: Network, label: 'Societies' },
  { href: '/verification', icon: Crown, label: 'Verifications', },
];

export default function LeftSidebar({ user = null }: LeftSidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { clearUser } = useUserStore();
  const { clearInstitution } = useInstitutionStore();
  const { unreadCount, clearNotifications } = useNotificationStore();
  const { unreadCount: unreadMessagesCount } = useChatStore();
  const { currentEntity, userType, entityType } = useCurrentEntity();

  console.log("current entity", currentEntity)

  const pathname = usePathname();
  const router = useRouter();
  const { clearFollowing, clearConnections } = useConnectionsStore();

  // Use the entity from utility or fallback to passed user prop
  const displayUser = currentEntity || user;
  const isVerified = displayUser?.verified ?? false;

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/';
    }

    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    clearUser();
    clearInstitution();
    clearFollowing();
    clearConnections();
    clearNotifications();
    router.push('/');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Ensure profile picture URL is always valid for next/image
  const buildSidebarImageUrl = (raw?: string | null): string | undefined => {
    if (!raw) return undefined;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return raw;
    return `https://${raw}`;
  };

  const sidebarProfilePicture = buildSidebarImageUrl(
    (displayUser as any)?.profile_picture
  );

  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col font-sans pt-3">
      <div className="p-4 pb-0 flex-shrink-0">
        <div className="xl:block hidden mb-8">
          <Logo />
        </div>
        <div className="xl:hidden block mb-8">
          <ShortLogo />
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto xl:px-3 px-2 min-h-0 mt-2 xl:mt-7">
        {navigations
          .filter(({ userTypes, href }) => {
            // Filter by userTypes
            if (userTypes && !userTypes.includes(userType || '')) {
              return false;
            }
            // Only show verifications tab if user is not verified
            if (href === '/verifications' && isVerified) {
              return false;
            }
            return true;
          })
          .map(({ href, icon: Icon, label, subheadings }) => {
            const hasSubheadings = subheadings && subheadings.length > 0;
            const isCurrentActive = isActive(href);
            const isExternalLink = href.startsWith('http://') || href.startsWith('https://');

            return (
              <div key={href}>
                {isExternalLink ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors relative`}
                  >
                    <div className="relative">
                      <Icon className={`h-6 w-6 text-gray-700 group-hover:text-gray-900 ${isCurrentActive ? 'text-gray-900 font-bold stroke-2' : ''}`} />
                      {href === '/notifications' && unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                      {href === '/messages' && unreadMessagesCount > 0 && !isCurrentActive && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </div>
                      )}
                    </div>
                    <span className={`xl:block hidden text-xl text-gray-900 ${isCurrentActive ? 'font-semibold' : 'font-normal'}`}>
                      {label}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={href}
                    className={`group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors relative`}
                  >
                    <div className="relative">
                      <Icon className={`h-6 w-6 text-gray-700 group-hover:text-gray-900 ${isCurrentActive ? 'text-gray-900 font-bold stroke-2' : ''}`} />
                      {href === '/notifications' && unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                      {href === '/messages' && unreadMessagesCount > 0 && !isCurrentActive && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </div>
                      )}
                    </div>
                    <span className={`xl:block hidden text-xl text-gray-900 ${isCurrentActive ? 'font-semibold' : 'font-normal'}`}>
                      {label}
                    </span>
                  </Link>
                )}

                {hasSubheadings && (
                  <div className="xl:ml-8 xl:mt-1 xl:mb-1 xl:flex xl:flex-col xl:gap-1 hidden">
                    {subheadings
                      ?.filter(({ userTypes }) => !userTypes || userTypes.includes(userType || ''))
                      .map(({ href: subHref, icon: SubIcon, label: subLabel }) => (
                        <Link
                          key={subHref}
                          href={subHref}
                          className={`flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors ${isActive(subHref) ? 'bg-gray-100' : ''
                            }`}
                        >
                          <SubIcon className={`h-5 w-5 text-gray-600 ${isActive(subHref) ? 'text-gray-900' : ''}`} />
                          <span className={`text-base text-gray-700 ${isActive(subHref) ? 'font-semibold text-gray-900' : ''}`}>
                            {subLabel}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      <div className="px-3 mb-2">
        {['HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'].includes(userType || '') && (
          <Link
            href="/dashboard/post-job"
            className={`group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-full flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors relative ${isActive('/dashboard/posted-jobs') ? 'bg-gray-50' : ''}`}
          >
            <div className="relative">
              <PlusCircle className={`h-6 w-6 text-gray-700 group-hover:text-gray-900 ${isActive('/dashboard/posted-jobs') ? 'text-gray-900 font-bold stroke-2' : ''}`} />
            </div>
            <span className={`xl:block hidden text-xl text-gray-900 ${isActive('/dashboard/posted-jobs') ? 'font-semibold' : 'font-normal'}`}>
              Post A New Job
            </span>
          </Link>
        )}
      </div>

      <div className="p-4 pt-0 border-t border-gray-100 flex-shrink-0">
        {displayUser ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center xl:gap-3 xl:px-3 xl:py-3 rounded-full hover:bg-gray-100 transition-colors w-full text-left"
            >
              <UserAvatar
                name={("firstName" in displayUser && displayUser.firstName) || displayUser.name || "User"}
                src={sidebarProfilePicture}
                className="w-10 h-10 flex-shrink-0"
              />
              <div className="xl:flex hidden flex-col flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {("firstName" in displayUser && displayUser.firstName) || displayUser.name || "User"}
                </h3>
                <p className="text-sm text-gray-500 truncate capitalize">
                  {/* {getDisplayHandle(displayUser)} */}
                  {"role" in displayUser ? displayUser.role : "type" in displayUser ? displayUser.type : ""}
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[999] animate-in slide-in-from-bottom-2 duration-200">
                <Link
                  href={`/profile/${displayUser.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </Link>
                <hr className="border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link href="/auth" className="xl:block hidden w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-full font-bold transition-colors">
              Sign in
            </Link>
            <Link href="/auth" className="xl:hidden flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors mx-auto">
              <UserIcon className="w-6 h-6" />
            </Link>
          </div>
        )}

        <span className='text-[8px] absolute bottom-0 left-0 text-gray-800'>Beta build {BETA_BUILD_VERSION}</span>
      </div>
    </aside>
  );
}
