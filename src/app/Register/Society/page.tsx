"use client";
import { useState } from "react";

export default function Society() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      name,
      username,
      email,
      password,
      mobile,
    });
  };

  return (
    <div className="w-[98%] md:w-1/2 m-auto">
      <div className="border px-3 border-gray-400 rounded-md mb-5">
        <div className="flex justify-center text-lg font-bold mt-2">
          Society's Registration
        </div>
        <div className="py-5">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-2">
              <label>Society Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-3 rounded-md p-[2px]"
                placeholder="Enter your name"
                type="text"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label>Username</label>
              <div className="flex items-center border rounded-md">
                <span className="px-2 w-[5%] text-lg">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded w-[70%] outline-none"
                  placeholder="yourusername"
                  type="text"
                />
                <button
                  type="button"
                  className="w-[25%] px-3 py-[2px] rounded-e bg-gray-900 text-white hover:cursor-pointer hover:bg-gray-800"
                >
                  Check Availability
                </button>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label>Email</label>
              <div className="flex items-center border rounded-md">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-[2px] rounded w-[80%] outline-none"
                  placeholder="name@example.com"
                  type="email"
                />
                <button
                  type="button"
                  className="w-[20%] px-3 py-[2px] rounded-e bg-gray-900 text-white hover:cursor-pointer hover:bg-gray-800"
                >
                  Send OTP
                </button>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label>Enter OTP</label>
              <div className="flex items-center border rounded-md">
                <input
                  className="px-3 py-[2px] rounded w-[80%] outline-none"
                  placeholder="123456"
                  type="text"
                />
                <button
                  type="button"
                  className="w-[20%] px-3 py-[2px] rounded-e bg-gray-900 text-white hover:cursor-pointer hover:bg-gray-800"
                >
                  Verify OTP
                </button>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label>Password</label>
              <input
                value={name}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 rounded-md p-[2px]"
                placeholder="Set your password"
                type="password"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
