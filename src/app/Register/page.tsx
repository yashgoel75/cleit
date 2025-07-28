"use client";

import logo from "@/assets/cleit.png";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Register() {
  const [registerAsMember, setRegisterAsMember] = useState(true);
  const [registerAsSociety, setRegisterAsSociety] = useState(false);
  return (
    <>
      <div className="flex justify-center">
        <Image src={logo} width={250} alt="cleit"></Image>
      </div>
      <div className="flex gap-4 justify-center mt-10 mb-5">
        <div
          onClick={() => {
            setRegisterAsMember(true);
            setRegisterAsSociety(false);
          }}
          className={`${
            registerAsMember ? "bg-gray-900 text-white" : "bg-white"
          } border-[] border-gray-900 outline-1 outline-gray-900 focus:outline-offset-1 rounded-md px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Member
        </div>
        <div
          onClick={() => {
            setRegisterAsSociety(true);
            setRegisterAsMember(false);
          }}
          className={`${
            registerAsSociety ? "bg-gray-900 text-white" : "bg-white"
          } border-[] border-gray-900 outline-1 outline-gray-900 focus:outline-offset-1 rounded-md px-3 py-1 w-fit hover:cursor-pointer`}
        >
          Register as Society
        </div>
      </div>
      <div className="w-98/100 md:w-1/2 m-auto">
        <div className="border-1 px-3 border-gray-400 rounded-md">hello</div>
      </div>
    </>
  );
}
