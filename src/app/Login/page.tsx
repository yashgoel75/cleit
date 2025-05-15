"use client";

import Image from "next/image";
import logo from "../../../public/cleit.png";
import cleitdarklogo from "../../../public/cleitdark.png";
import { useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';

function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={logo} alt="Cleit" width={500} />
      <br></br>
      <ConnectButton label="Continue with Ethereum" showBalance={false} chainStatus="none" accountStatus="avatar"/>
    </div>
  );
}

export default Login;
