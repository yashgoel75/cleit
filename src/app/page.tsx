"use client";
import Header from "./Header/page";
import Footer from "./Footer/page";
import { useState, useEffect } from "react";
export default function Home() {
  useEffect(() => {
    async function getSocieties() {
      const res = await fetch(`/api/`);
    }
    getSocieties;
  }, []);
  return (
    <>
      <Header />

      <div className="min-h-[85vh] flex justify-center items-center px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 relative z-10">
            Discover every college society in&nbsp;
            <span className="relative inline-block">
              <span className="relative z-10">
                <i>one place</i>
              </span>
            </span>{" "}
            — <br className="hidden md:block" />
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

      <section id="explore"></section>

      <Footer />
    </>
  );
}
