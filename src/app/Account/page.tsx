"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Header from "../Header/page";
import Footer from "@/app/Footer/page";
import { useRouter } from "next/navigation";

export default function Account() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameAlreadyTaken, setUsernameAlreadyTaken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setCurrentUser(user);
        getUserByEmail(user.email);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserByEmail = async (email: string) => {
    try {
      const res = await fetch(`/api/user/account?email=${encodeURIComponent(email)}`);
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

  const handleUpdate = async () => {
    if (!currentUser) return;
    setIsUpdating(true);

    try {
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser.email,
          updates: formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update user");
      }

      await getUserByEmail(formData.email);
      setIsEdit(false);
      setIsPreview(true);
      setUsernameAvailable(false);
      setUsernameAlreadyTaken(false);
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const isUsernameAvailable = async () => {
    try {
      const res = await fetch(`/api/register/member?username=${formData.username}`);
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

  return (
    <>
      <Header />
      <main className="w-[95%] min-h-[85vh] lg:w-full max-w-4xl mx-auto py-10 md:py-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
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
                Batch: {userData?.batchStart} - {userData?.batchEnd}
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-4">Wishlist</h4>
              {userData?.wishlist?.length > 0 ? (
                <ul className="text-gray-700 space-y-1">
                  {userData.wishlist.map((item: any, idx: number) => (
                    <li key={idx}>❤️ {item.societyUsername}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No societies in wishlist.</p>
              )}
            </div>

            <div>
              <h4 className="text-2xl font-semibold mb-4">Reminders</h4>
              {userData?.reminders?.length > 0 ? (
                <ul className="text-gray-700 space-y-1">
                  {userData.reminders.map((item: any, idx: number) => (
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
              <h3 className="text-2xl font-bold mb-4 text-center">Edit User Info</h3>

              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({ ...prev, name: e.target.value }))
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
                    onChange={(e) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        username: e.target.value,
                      }));
                      setUsernameAvailable(false);
                      setUsernameAlreadyTaken(false);
                    }}
                    placeholder="Enter unique username"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={isUsernameAvailable}
                    className="text-center rounded-md px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white"
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
                    setFormData((prev: any) => ({ ...prev, branch: e.target.value }))
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
                    value={formData?.batchStart || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        batchStart: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 2022"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-medium mb-1">Batch End</label>
                  <input
                    type="number"
                    value={formData?.batchEnd || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        batchEnd: Number(e.target.value),
                      }))
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition w-full sm:w-fit disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setIsPreview(true);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-semibold transition w-full sm:w-fit"
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
