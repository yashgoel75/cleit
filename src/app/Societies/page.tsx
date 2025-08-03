"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Header from "../Header/page";
import Footer from "../Footer/page";

// Assume you have these icons in your assets folder
// Using the paths from your Home component
import linkedin from "@/assets/LinkedIn.png";
import instagram from "@/assets/Instagram.png";

// TypeScript interface for a single society
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
}

export default function SocietiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Effect 1: Handle Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Effect 2: Fetch all societies on component mount
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
          setError("Error!");
        }
      } finally {
        setLoading(false);
      }
    }

    getSocieties();
  }, []);

  // Add to Wishlist function from your Home component
  const addToWishlist = async (societyUsername: string) => {
    if (!user || !user.email) {
      router.push("/auth/Login");
      return;
    }
    try {
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          wishlistAdd: societyUsername,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add to wishlist");
      }
      // Optimistically update the UI
      setWishlist((prev) => [...prev, societyUsername]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert(`Unable to add to wishlist: ${err.message}`);
      } else {
        console.error("Error");
        alert(`Unable to add to wishlist`);
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

    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${societies.length == 1 ? "lg:grid-cols-1" : societies.length == 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-10 justify-items-center`}
      >
        {societies.map((society) => {
          const isWishlist = wishlist.includes(society.username);

          const today = new Date();
          const eventCount = Array.isArray(society.events)
            ? society.events.filter((e) => {
                const start = new Date(e.startDate);
                const end = e.endDate ? new Date(e.endDate) : start;
                return start >= today || (start <= today && end >= today);
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
                    <p className="text-gray-500 text-sm">@{society.username}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
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
                      className={`font-semibold ${society.auditionOpen ? "text-green-600" : "text-red-500"}`}
                    >
                      {society.auditionOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>

                {Array.isArray(society.social) && society.social.length > 0 && (
                  <div className="mt-4 flex items-center gap-3">
                    {society.social.map((acc) => {
                      if (!acc?.handle) return null;
                      const platform = acc.name.toLowerCase();
                      const url = acc.handle.startsWith("http")
                        ? acc.handle
                        : `https://${acc.handle}`;

                      const icon =
                        platform === "linkedin" ? linkedin : instagram;
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
    );
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="w-[95%] min-h-[85vh] lg:w-full max-w-6xl mx-auto py-10 md:py-20 px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Explore Societies
          </h2>
          {renderContent()}
        </div>
      </main>
      <div className="w-full bottom-0">
        <Footer />
      </div>
    </>
  );
}
