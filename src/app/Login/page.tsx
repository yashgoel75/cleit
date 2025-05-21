"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/cleit.png";
import cleitdarklogo from "../../../public/cleitdark.png";
import "./page.css";

function Login() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={logo} alt="Cleit" width={400} />
      <br />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Cleit</h1>
      </div>
      <div className="dashboard-button" onClick={() => router.push("/Dashboard")}>
        Go to Dashboard →
      </div>
    </div>
  );
}

export default Login;
