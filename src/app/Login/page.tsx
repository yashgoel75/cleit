"use client";

import logo from "@/assets/cleit.png";
import Image from "next/image";

export default function Login() {
  return (
    <>
      <div className="flex justify-center">
        <Image src={logo} width={250} alt="cleit"></Image>
      </div>
    </>
  );
}
