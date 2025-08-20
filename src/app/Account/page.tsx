"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Header from "../Header/page";
import Footer from "@/app/Footer/page";
import Link from "next/link";
import Image from "next/image";
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

interface User {
  name: string;
  username: string;
  email: string;
  password: string;
  branch: string;
  batchStart: number;
  batchEnd: number;
  wishlist: { societyUsername: string }[];
  reminders: { societyUsername: string }[];
}

interface Wishlist {
  societyUsername: string;
}

interface Reminders {
  societyUsername: string;
}

export default function Account() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameAlreadyTaken, setUsernameAlreadyTaken] = useState(false);
  const [expandedWishlist, setExpandedWishlist] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setCurrentUser(user);
        getUserByEmail(user.email);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setFormData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserByEmail = async (email: string) => {
    try {
      const token = await getFirebaseToken();
      const res = await fetch(
        `/api/user/account?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user data");
      setUserData(data.user);
      setFormData(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (username: string) => {
    if (!currentUser) return;
    const token = await getFirebaseToken();
    const res = await fetch("/api/user/account", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userEmail: currentUser.email,
        societyUsername: username,
      }),
    });

    if (res.ok) {
      getUserByEmail(userData!.email);
    }
  };
  useEffect(() => {
    if (userData?.wishlist?.length) {
      const fetchWishlistSocieties = async () => {
        try {
          const token = await getFirebaseToken();
          const res = await fetch(`/api/society`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to load societies");

          const wishlistSocieties = data.societies.filter((society: Society) =>
            userData.wishlist.some(
              (item) => item.societyUsername === society.username,
            ),
          );
          setSocieties(wishlistSocieties);
        } catch (err: unknown) {
          console.error(err);
        }
      };
      fetchWishlistSocieties();
    } else {
      setSocieties([]);
    }
  }, [userData]);

  const handleUpdate = async () => {
    if (!currentUser) return;
    setIsUpdating(true);

    try {
      const token = await getFirebaseToken();
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: currentUser.email,
          updates: formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update user");
      }

      if (formData?.email) {
        await getUserByEmail(formData.email);
      }

      setIsEdit(false);
      setIsPreview(true);
      setUsernameAvailable(false);
      setUsernameAlreadyTaken(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Update failed: ${err.message}`);
      } else {
        alert(`Update failed`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const isUsernameAvailable = async () => {
    try {
      const res = await fetch(
        `/api/register/member?username=${formData?.username}`,
      );
      const data = await res.json();

      if (data.usernameExists) {
        setUsernameAvailable(false);
        setUsernameAlreadyTaken(true);
      } else {
        setUsernameAvailable(true);
        setUsernameAlreadyTaken(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlistItem = (societyUsername: string) => {
    setExpandedWishlist((prev) =>
      prev.includes(societyUsername)
        ? prev.filter((item) => item !== societyUsername)
        : [...prev, societyUsername],
    );
  };

  if (!formData || !userData) return null;

  return (
    <>
      <Header />
      <main className="w-[95%] min-h-[85vh] lg:w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Manage Your Account
        </h2>

        <div className="flex justify-center items-center gap-4 pb-10 font-medium">
          <button
            onClick={() => {
              setIsPreview(false);
              setIsEdit(true);
              setFormData(userData);
            }}
            className={`px-5 md:text-lg py-1 rounded-md border transition duration-300 hover:cursor-pointer ${
              isEdit
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setIsEdit(false);
              setIsPreview(true);
              setUsernameAvailable(false);
              setUsernameAlreadyTaken(false);
            }}
            className={`px-5 md:text-lg py-1 rounded-md border transition duration-300 hover:cursor-pointer ${
              isPreview
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            }`}
          >
            Preview
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isPreview ? (
          <div className="space-y-10 text-center">
            <div>
              <h3 className="text-3xl font-bold">{userData?.name}</h3>
              <p className="text-gray-600 text-lg">@{userData?.username}</p>
              <p className="text-gray-700 mt-2">{userData?.email}</p>
              <p className="text-gray-700 mt-1 font-medium">
                Branch: {userData?.branch}
              </p>
              <p className="text-gray-700 font-medium">
                Batch: {Number(userData?.batchStart)} -{" "}
                {Number(userData?.batchEnd)}
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-4">Wishlist</h4>
              {userData?.wishlist?.length > 0 ? (
                <ul className="text-gray-700 space-y-4">
                  {userData.wishlist.map((item: Wishlist, idx: number) => {
                    const society = societies.find(
                      (s) => s.username === item.societyUsername,
                    );
                    const isExpanded = expandedWishlist.includes(
                      item.societyUsername,
                    );

                    return (
                      <li key={idx} className="space-y-2 hover">
                        <button
                          onClick={() =>
                            toggleWishlistItem(item.societyUsername)
                          }
                          className="hover:cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                        >
                          {item.societyUsername}
                          {isExpanded ? " ▼" : " ▶"}
                        </button>
                        {isExpanded && society && (
                          <div className="bg-white border border-gray-200 hover:shadow-xl rounded-xl p-6 transition-all duration-300 flex flex-col justify-between w-full max-w-sm mx-auto text-left">
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

                              <div className="mt-4 space-y-2 text-sm text-gray-700">
                                <div>
                                  <strong>Council Members:</strong>&nbsp;
                                  {society.team?.length ?? "N/A"}
                                </div>
                                <div>
                                  <strong>Events:</strong>&nbsp;
                                  {Array.isArray(society.events)
                                    ? (() => {
                                        const upcomingEvents =
                                          society.events.filter((e) => {
                                            const start = new Date(e.startDate);
                                            const end = e.endDate
                                              ? new Date(e.endDate)
                                              : start;
                                            const today = new Date();
                                            return (
                                              start >= today ||
                                              (start <= today && end >= today)
                                            );
                                          });
                                        return upcomingEvents.length > 0
                                          ? `${upcomingEvents.length} upcoming`
                                          : "No upcoming events";
                                      })()
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
                                onClick={() => handleDelete(society.username)}
                                className="text-red-600 font-semibold text-sm hover:text-red-800 transition-colors hover:cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No societies in wishlist.
                </p>
              )}
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-4">Reminders</h4>
              {userData?.reminders?.length > 0 ? (
                <ul className="text-gray-700 space-y-1">
                  {userData.reminders.map((item: Reminders, idx: number) => (
                    <li key={idx}>⏰ {item.societyUsername}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No event reminders set.</p>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Edit User Info
              </h3>

              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Username</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData?.username || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev ? { ...prev, username: e.target.value } : null,
                      )
                    }
                    placeholder="Enter unique username"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={isUsernameAvailable}
                    className="text-center rounded-md px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white hover:cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {usernameAvailable && (
                  <p className="text-green-600 text-sm mt-1">
                    Username Available
                  </p>
                )}
                {usernameAlreadyTaken && (
                  <p className="text-red-600 text-sm mt-1">
                    Username Already Taken
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData?.email || ""}
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={formData?.branch || ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, branch: e.target.value } : null,
                    )
                  }
                  placeholder="e.g. AIML"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Batch Start</label>
                  <input
                    type="number"
                    value={Number(formData?.batchStart) || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? { ...prev, batchStart: Number(e.target.value) }
                          : null,
                      )
                    }
                    placeholder="e.g. 2022"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-medium mb-1">Batch End</label>
                  <input
                    type="number"
                    value={Number(formData?.batchEnd) || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? { ...prev, batchEnd: Number(e.target.value) }
                          : null,
                      )
                    }
                    placeholder="e.g. 2026"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition w-full sm:w-fit disabled:bg-indigo-300 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setIsPreview(true);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-semibold transition w-full sm:w-fit hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
