"use client";

import Image from "next/image";
import logo from "../../../public/cleit.png";
import cleitdarklogo from "../../../public/cleitdark.png";
import { useState } from "react";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to my RainbowKit app",
});
function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={logo} alt="Cleit" width={500} />
      <br></br>
      <RainbowKitSiweNextAuthProvider
        getSiweMessageOptions={getSiweMessageOptions}
      >
        {" "}
      </RainbowKitSiweNextAuthProvider>
      ;
    </div>
  );
}

export default Login;
