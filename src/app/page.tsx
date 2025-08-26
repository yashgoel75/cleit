"use client";

import Header from "./Header/page";
import Footer from "./Footer/page";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import linkedin from "@/assets/LinkedIn.png";
import instagram from "@/assets/Instagram.png";
import { getFirebaseToken } from "@/utils";

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

interface SocialLink {
  name: string;
  handle: string;
}

interface Society {
  _id: string;
  name: string;
  username: string;
  logo: string;
  about: string;
  team?: TeamMember[];
  events?: Event[];
  auditionOpen?: boolean;
  social?: SocialLink[];
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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getSocieties() {
      try {
        const res = await fetch(`/api/society`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load societies");
        setSocieties(data.societies || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error");
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
      return <p className="text-center text-gray-500">Loading societies...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (societies.length === 0) {
      return (
        <p className="text-center text-gray-500 italic">No societies found.</p>
      );
    }

    const filteredSocieties =
      selectedType === "All"
        ? societies
        : societies.filter((s) => s.type === selectedType);

    if (filteredSocieties.length === 0) {
      return (
        <p className="text-center text-gray-500 italic pt-8">
          No societies found for this category.
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
        {sortedCategories.map((type) => (
          <div key={type}>
            <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-3 border-b-2 border-indigo-200">
              {type}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedSocieties[type].map((society) => {
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
                    className="bg-white border border-gray-200 hover:shadow-lg rounded-xl p-6 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={society.logo}
                          alt={`${society.name} logo`}
                          className="w-16 h-16 object-cover rounded-full border-1 border-indigo-700"
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
                            ? `${eventCount} upcoming or ongoing`
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

                      {Array.isArray(society.social) && (
                        <div className="mt-3 flex items-center gap-3">
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
                                  width={20}
                                  height={20}
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
                        className={`text-sm font-semibold px-3 py-2 rounded-md ${
                          isWishlist
                            ? "bg-green-100 text-green-700 cursor-default"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        } hover:cursor-pointer`}
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
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-[85vh] flex justify-center items-center px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Discover every college society in&nbsp;
            <span className="relative inline-block">
              <i>one place</i>
            </span>
            <br />
            <span className="bg-indigo-100 px-2 rounded-md">
              explore, wishlist, join
            </span>
            , and&nbsp;
            <span className="text-indigo-600 underline underline-offset-4 decoration-2">
              never miss a moment.
            </span>
          </h1>
          <p className="mt-6 text-gray-500 text-lg md:text-xl">
            Your campus life, organized and elevated.
          </p>
          <div className="mt-8">
            <a
              href="#explore"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Explore Societies
            </a>
          </div>
        </div>
      </div>

      <section
        id="explore"
        className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white  border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            All Societies
          </h2>

          <div className="mb-12 flex justify-center">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none w-64 bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow transition"
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
      </section>

      <Footer />
    </>
  );
}
