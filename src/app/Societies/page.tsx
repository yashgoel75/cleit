"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Header from "../Header/page";
import Footer from "../Footer/page";

import linkedin from "@/assets/LinkedIn.png";
import instagram from "@/assets/Instagram.png";
import { getFirebaseToken } from "@/utils";

interface EligibilityCriterion {
  name: string;
}

interface SocialLink {
  name: "LinkedIn" | "Instagram" | string;
  handle: string;
}

interface TeamMember {
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  type?: string;
  venue: string;
  time: string;
  startDate: string;
  endDate?: string;
  about: string;
  socialGroup?: string;
}

interface Society {
  _id: string;
  name: string;
  username: string;
  email: string;
  logo: string;
  website: string;
  about: string;
  auditionOpen: boolean;
  centralized: boolean;
  team: TeamMember[];
  events: Event[];
  social: SocialLink[];
  eligibility: EligibilityCriterion[];
  type: string;
}

const SOCIETY_TYPES = [
  "All",
  "Academic & Technical",
  "Cultural & Arts",
  "Social & Service",
  "Sports & Fitness",
  "Leadership & Communication",
  "Misc / Special Interest",
  "Others",
];

export default function SocietiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getSocieties() {
      setLoading(true);
      try {
        const res = await fetch(`/api/society`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load societies");
        setSocieties(data.societies || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    getSocieties();
  }, []);

  const addToWishlist = async (societyUsername: string) => {
    if (!user || !user.email) {
      router.push("/auth/Login");
      return;
    }
    try {
      const token = await getFirebaseToken();
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          wishlistAdd: societyUsername,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add to wishlist");
      }
      setWishlist((prev) => [...prev, societyUsername]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert(`Unable to add to wishlist: ${err.message}`);
      } else {
        console.error("Unknown error adding to wishlist");
        alert(`An unknown error occurred while adding to wishlist.`);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className="text-center text-gray-500 text-lg">
          Loading societies...
        </p>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 text-lg">{error}</p>;
    }
    if (societies.length === 0) {
      return (
        <p className="text-center text-gray-500 italic text-lg">
          No societies found.
        </p>
      );
    }

    const filteredSocieties = societies.filter((s) => {
      const matchesType = selectedType === "All" || s.type === selectedType;
      const matchesSearch = searchQuery
        ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.username.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });

    if (filteredSocieties.length === 0) {
      return (
        <p className="text-center text-gray-500 italic text-lg pt-8">
          No societies found for this category or search query.
        </p>
      );
    }

    const groupedSocieties = filteredSocieties.reduce(
      (acc, society) => {
        const type = society.type || "Others";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(society);
        return acc;
      },
      {} as Record<string, Society[]>,
    );

    const sortedCategories = Object.keys(groupedSocieties).sort((a, b) => {
      const sortOrder = SOCIETY_TYPES.slice(1);
      return sortOrder.indexOf(a) - sortOrder.indexOf(b);
    });

    return (
      <div className="space-y-16">
        {sortedCategories.map((type) => {
          const societiesOfType = groupedSocieties[type];

          return (
            <div key={type}>
              <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-3 border-b-2 border-indigo-200">
                {type}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {societiesOfType.map((society) => {
                  const isWishlist = wishlist.includes(society.username);
                  const today = new Date();
                  const eventCount = Array.isArray(society.events)
                    ? society.events.filter((e) => {
                        const start = new Date(e.startDate);
                        const end = e.endDate ? new Date(e.endDate) : start;
                        return (
                          start >= today || (start <= today && end >= today)
                        );
                      }).length
                    : 0;

                  return (
                    <div
                      key={society._id}
                      className="bg-white border border-gray-200 hover:shadow-xl rounded-xl p-6 transition-all duration-300 flex flex-col justify-between w-full max-w-sm transform hover:-translate-y-1"
                    >
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={society.logo}
                            alt={`${society.name} logo`}
                            className="w-16 h-16 object-cover rounded-full border-2 border-indigo-100"
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {society.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              @{society.username}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {society.about}
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                          <div>
                            <strong>Council Members:</strong>&nbsp;
                            {society.team?.length ?? "N/A"}
                          </div>
                          <div>
                            <strong>Events:</strong>&nbsp;
                            {eventCount > 0
                              ? `${eventCount} upcoming`
                              : "No upcoming events"}
                          </div>
                          <div>
                            <strong>Auditions:</strong>&nbsp;
                            <span
                              className={`font-semibold ${
                                society.auditionOpen
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {society.auditionOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>

                        {Array.isArray(society.social) &&
                          society.social.length > 0 && (
                            <div className="mt-4 flex items-center gap-3">
                              {society.social.map((acc) => {
                                if (!acc?.handle) return null;
                                const platform = acc.name.toLowerCase();
                                const url = acc.handle.startsWith("http")
                                  ? acc.handle
                                  : `https://${acc.handle}`;
                                const icon =
                                  platform === "linkedin"
                                    ? linkedin
                                    : instagram;
                                return (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Image
                                      src={icon}
                                      alt={`${acc.name} icon`}
                                      width={22}
                                      height={22}
                                      className="hover:scale-110 transition-transform"
                                    />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                      </div>

                      <div className="mt-6 flex justify-between items-center gap-2">
                        <Link
                          href={`/org/${society.username}`}
                          className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors"
                        >
                          View Details →
                        </Link>

                        <button
                          onClick={() => addToWishlist(society.username)}
                          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:cursor-pointer ${
                            isWishlist
                              ? "bg-green-100 text-green-700 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
                          }`}
                          disabled={isWishlist}
                        >
                          {isWishlist ? "Added" : "Add to Wishlist"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Explore Societies
          </h2>

          <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search societies by name or username..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 shadow-sm transition-all"
                aria-label="Search societies"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="relative w-full sm:w-64">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow-sm transition-all"
                aria-label="Filter societies by type"
              >
                {SOCIETY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
      <div className="w-full bottom-0">
        <Footer />
      </div>
    </>
  );
}
