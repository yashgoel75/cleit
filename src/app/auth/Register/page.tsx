"use client";

import logo from "@/assets/cleit.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Member from "./Member/page";
import "./page.css";
import Footer from "../Footer/page";

export default function Register() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex justify-center onest-normal">
        <Image src={logo} width={isMobile ? 150 : 200} alt="cleit"></Image>
      </div>
      <div className="border-1 border-gray-200 mt-2"></div>
      <div className="flex gap-2 md:gap-4 justify-center mt-10">
        {/* <div
          onClick={() => {
            setRegisterAsMember(true);
            setRegisterAsSociety(false);
          }}
          className={`${
            registerAsMember ? "bg-indigo-500 text-white" : "bg-white"
          } border-[] border-gray-400 outline-1 outline-gray-300 focus:outline-offset-1 rounded-lg px-2 md:px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Member
        </div> */}
        {/* <div
          onClick={() => {
            setRegisterAsSociety(true);
            setRegisterAsMember(false);
          }}
          className={`${
            registerAsSociety ? "bg-indigo-500 text-white" : "bg-white"
          } border-[] border-gray-400 outline-1 outline-gray-300 focus:outline-offset-1 rounded-lg px-2 md:px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Society
        </div> */}
      </div>
      <Member></Member>
      <Footer></Footer>
    </>
  );
}
