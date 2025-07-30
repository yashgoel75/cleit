"use client";

import logo from "@/assets/cleit.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between px-5">
        <Image src={logo} className="px-5" width={270} alt="Cleit"></Image>
        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/auth/Login")}
            className="px-3  text-[17px] py-1 bg-gray-900 text-white border-gray-900 border -1 border-gray-900 rounded-md hover:cursor-pointer hover:bg-gray-700"
          >
            Login
          </div>
          <div
            onClick={() => router.push("/auth/Register")}
            className="px-3 text-[17px] py-1 mr-5 rounded-md border-1 border-gray-300 hover:bg-zinc-100 hover:cursor-pointer"
          >
            Register
          </div>
        </div>
      </div>
    </>
  );
}
