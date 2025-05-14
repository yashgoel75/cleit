"use client";

import Image from "next/image";
import logo from "../../../public/cleit.png";
import cleitdarklogo from "../../../public/cleitdark.png";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Providers from "../Providers";
function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={logo} alt="Cleit" width={450} />
      <br></br>
      <ConnectButton />
    </div>
  );
}

export default Login;
