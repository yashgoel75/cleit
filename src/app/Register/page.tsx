"use client";

import logo from "@/assets/cleit.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Member from "./Member/page";
import Society from "./Society/page";
import "./page.css";

export default function Register() {
  const [registerAsMember, setRegisterAsMember] = useState(true);
  const [registerAsSociety, setRegisterAsSociety] = useState(false);
  return (
    <>
      
      <div className="flex justify-center onest-normal">
        <Image src={logo} width={200} alt="cleit"></Image>
      </div>
      <div className="flex gap-4 justify-center mt-10 mb-5">
        <div
          onClick={() => {
            setRegisterAsMember(true);
            setRegisterAsSociety(false);
          }}
          className={`${
            registerAsMember ? "bg-indigo-500 text-white" : "bg-white"
          } border-[] border-gray-400 outline-1 outline-gray-300 focus:outline-offset-1 rounded-md px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Member
        </div>
        <div
          onClick={() => {
            setRegisterAsSociety(true);
            setRegisterAsMember(false);
          }}
          className={`${
            registerAsSociety ? "bg-indigo-500 text-white" : "bg-white"
          } border-[] border-gray-400 outline-1 outline-gray-300 focus:outline-offset-1 rounded-md px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Society
        </div>
      </div>
      {registerAsMember ? <Member></Member> : null}
      {registerAsSociety ? <Society></Society> : null}
    </>
  );
}
