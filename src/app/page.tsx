"use client";

import Header from "./Header/page";
import Footer from "./Footer/page";
import { useState, useEffect } from "react";
import Link from "next/link";
import linkedin from "@/assets/LinkedIn.png";
import instagram from "@/assets/Instagram.png";
import Image from "next/image";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Society {
  _id: string;
  name: string;
  username: string;
  logo: string;
  about: string;
  team?: any[];
  events?: any[];
  auditionOpen?: boolean;
  social?: { name: string; handle: string }[];
}


export default function Home() {
    const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  console.log("email: ", user?.email);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    async function getSocieties() {
      try {
        const res = await fetch(`/api/society`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load societies");
        setSocieties(data.societies || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getSocieties();
  }, []);

  const addToWishlist = async (societyUsername: string) => {
    try {
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email, wishlistAdd: societyUsername }),
      });

      if (!res.ok) throw new Error("Failed to add to wishlist");
      setWishlist((prev) => [...prev, societyUsername]);
    } catch (err) {
      console.error(err);
      alert("Unable to add to wishlist.");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-[85vh] flex justify-center items-center px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Discover every college society in{" "}
            <span className="relative inline-block">
              <i>one place</i>
            </span>
            <br />
            <span className="bg-indigo-100 px-2 rounded-md">
              explore, wishlist, join
            </span>
            , and{" "}
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

      <section id="explore" className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">All Societies</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading societies...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : societies.length === 0 ? (
            <p className="text-center text-gray-500 italic">No societies found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="bg-white border border-gray-200 hover:shadow-lg rounded-xl p-6 transition duration-300 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={society.logo}
                        alt={`${society.name} logo`}
                        className="w-16 h-16 object-cover rounded-full border-1 border-indigo-700"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{society.name}</h3>
                        <p className="text-gray-500 text-sm">@{society.username}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">{society.about}</p>

                    <div className="mt-4 text-sm text-gray-700">
                      <strong>Council Members:</strong> {society.team?.length ?? "N/A"}
                    </div>

                    {/* Events + Audition */}
                    <div className="mt-4 text-sm text-gray-700">
                      <div>
                        <strong>Events:</strong>{" "}
                        {eventCount > 0
                          ? `${eventCount} upcoming or ongoing`
                          : "No upcoming events"}
                      </div>
                      <div>
                        <strong>Auditions:</strong>{" "}
                        <span className={`font-semibold ${society.auditionOpen ? "text-green-600" : "text-red-500"}`}>
                          {society.auditionOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>

                    {/* Social Icons */}
                    {Array.isArray(society.social) && (
                      <div className="mt-3 flex items-center gap-3">
                        {["LinkedIn", "Instagram"].map((platform) => {
                          const acc = society.social?.find((s) =>
                            s.name.toLowerCase() === platform.toLowerCase()
                          );
                          if (!acc?.handle) return null;
                          const url =
                            platform === "LinkedIn"
                              ? `https://www.linkedin.com/in/${acc.handle}`
                              : `https://www.instagram.com/${acc.handle}`;
                          const icon = platform === "LinkedIn" ? linkedin : instagram;
                          return (
                            <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                              <Image src={icon} alt={`${platform} icon`} width={20} height={20} className="hover:scale-110 transition-transform" />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Button row */}
                    <div className="mt-6 flex justify-between items-center gap-2">
                      <Link href={`/org/${society.username}`} passHref>
                          View Details →
                      </Link>

                      <button
                        onClick={() => addToWishlist(society.username)}
                        className={`text-sm font-semibold px-3 py-2 rounded-md ${
                          isWishlist ? "bg-green-100 text-green-700 cursor-default" : "bg-indigo-600 hover:bg-indigo-700 text-white"
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
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
