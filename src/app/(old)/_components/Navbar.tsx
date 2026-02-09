"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { User } from "@/lib/api";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<User[]>([]); // Explicit type
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true);
    try {
    //   const response = await userService.searchUsers(
    //     searchTerm, // q (required)
    //     searchTerm, // name (optional)
    //     undefined,  // location
    //     undefined   // role
    //   );
    //   setResults(response?.data || []); // Optional chaining
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
  };

  const handleProfileClick = (userId: string) => {
    setShowDropdown(false);
    navigate.push(`/profile/${userId}`);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".search-dropdown") &&
        !event.target.closest(".search-input")
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      className="fixed w-full top-0 z-50 bg-white/95 border-b border-gray-100 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="PharmInc Logo"
              className="h-8 w-auto rounded-md"
            />
          </Link>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSearch}>
            <div className="relative rounded-full bg-gray-100 px-3 py-2 flex items-center w-full">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name"
                className="ml-2 bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 search-input"
                onFocus={() => searchTerm && setShowDropdown(true)}
                autoComplete="off"
              />
              <button type="submit" className="ml-2 text-blue-600 font-semibold">
                Search
              </button>
            </div>
          </form>
          {loading && (
            <div className="text-sm mt-2 bg-white border rounded shadow p-2">
              Loading...
            </div>
          )}
          {showDropdown && results.length > 0 && (
            <ul className="search-dropdown bg-white border rounded shadow mt-2 max-h-60 overflow-y-auto absolute w-full z-50">
              {results.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleProfileClick(user.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  {user.profile_picture && (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          )}
          {showDropdown && !loading && results.length === 0 && (
            <div className="search-dropdown bg-white border rounded shadow mt-2 absolute w-full z-50 p-2 text-gray-500">
              No users found
            </div>
          )}
        </div>

        {/* Navigation Icons and Profile */}
        <div className="flex items-center gap-2">
          <Link href="/home-feed">
            <Button variant="ghost" size="sm" className="p-2">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/research">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Users className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Briefcase className="h-5 w-5" />
            </Button>
          </Link>
          {/* ...Messages and Notifications dropdowns... */}
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/pp.png" alt="Profile" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
