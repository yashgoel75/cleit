"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import logo from "@/assets/cleit.png";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const [isLogoutConfirmationMessage, setIsLogoutConfirmationMessage] =
    useState(false);

  useEffect(() => {
    const resizeHandler = () => setIsMobile(window.innerWidth <= 768);
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user?.email) fetchUserName(user.email);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserName = async (email: string) => {
    try {
      const response = await fetch(
        `/api/user/account?email=${encodeURIComponent(email)}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch user");
      setDisplayName(data.user.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutConfirmation = () => {
    setIsLogoutConfirmationMessage(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const AuthButtons = () => (
    <div className="flex gap-3">
      <button
        onClick={() => router.push("/auth/Login")}
        className="text-sm md:text-base px-4 py-1.5 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition hover:cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => router.push("/auth/Register")}
        className="text-sm md:text-base px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition hover:cursor-pointer"
      >
        Register
      </button>
    </div>
  );

  const UserMenu = () => (
    <div className="flex items-center gap-5">
      {isLogoutConfirmationMessage ? (
        <div className="flex-1">
          <div>
            <span className="text-red-500 text-base">
              Are you sure you want to logout?
            </span>
          </div>
          <div className="flex gap-4">
            <button
              className="hover:cursor-pointer text-red-700"
              onClick={handleLogout}
            >
              Yes
            </button>
            <button
              className="hover:cursor-pointer"
              onClick={() => setIsLogoutConfirmationMessage(false)}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <button
          title="Logout"
          onClick={handleLogoutConfirmation}
          className="text-gray-600 hover:text-red-500 transition hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <>
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 px-5 py-4">
          <div className="flex justify-between items-center mb-6">
            <Link className="focus:outline-none" href={"/"}>
              <Image src={logo} width={140} alt="Cleit" />
            </Link>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="text-2xl text-gray-800 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="space-y-5 text-lg">
            {user ? (
              <>
                <p
                  onClick={() => router.push("/Account")}
                  className="font-semibold cursor-pointer"
                >
                  {displayName}
                </p>
                <p
                  onClick={() => router.push("/Societies")}
                  className="font-semibold cursor-pointer"
                >
                  Societies
                </p>
                {isLogoutConfirmationMessage ? (
                  <div className="flex-1">
                    <div>
                      <span className="text-red-500">
                        Are you sure you want to logout?
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button
                        className="hover:cursor-pointer text-red-700"
                        onClick={handleLogout}
                      >
                        Yes
                      </button>
                      <button
                        className="hover:cursor-pointer"
                        onClick={() => setIsLogoutConfirmationMessage(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLogoutConfirmation}
                    className="text-red-600 font-medium underline hover:cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      )}

      <header className="w-full px-5 py-4 flex items-center justify-between bg-white border-b border-gray-300 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link className="focus:outline-none" href={"/"}>
            <Image src={logo} width={isMobile ? 140 : 170} alt="Cleit" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <>
              <button
                onClick={() => router.push("/Account")}
                className="font-semibold text-lg hover:text-indigo-700 transition hover:cursor-pointer"
              >
                {displayName}
              </button>
              <p
                onClick={() => router.push("/Societies")}
                className="cursor-pointer font-semibold hover:underline text-lg"
              >
                Societies
              </p>
              <UserMenu />
            </>
          ) : (
            <AuthButtons />
          )}
        </div>

        <div className="block lg:hidden">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="26px"
              viewBox="0 -960 960 960"
              width="26px"
              fill="#333"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
