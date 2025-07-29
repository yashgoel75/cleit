"use client";
import { useState } from "react";
import axios from "axios";

export default function Member() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      name,
      username,
      email,
      password,
      mobile,
      startYear,
      endYear,
      department,
    };
    const res = await axios.post("/api/register/member", body);
    console.log(res.data);
  };

  return (
    <div className="w-[98%] md:w-1/2 m-auto">
      <div className="border px-3 border-gray-400 rounded-md mb-5">
        <div className="flex justify-center text-lg font-bold mt-2">
          Member's Registration
        </div>
        <div className="py-5">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col mb-2">
              <label>Name</label>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 rounded-md p-[2px]"
                placeholder="Set your password"
                type="password"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label>Mobile</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border px-3 rounded-md py-[2px]"
                placeholder="9876543210"
                type="tel"
              />
            </div>

            <div className="flex w-full justify-between items-end gap-3 mb-2">
              <div className="flex flex-col w-1/2">
                <label>Start Year</label>
                <input
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="border px-3 rounded-md py-[2px]"
                  placeholder="2023"
                  type="number"
                />
              </div>
              <span className="text-xl font-bold">-</span>
              <div className="flex flex-col w-1/2">
                <label>End Year</label>
                <input
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className="border px-3 rounded-md py-[2px]"
                  placeholder="2027"
                  type="number"
                />
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label>Department & Branch</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border rounded-md py-[2px]"
              >
                <option value="">Select...</option>
                <option>BALLB (H)</option>
                <option>BBALLB (H)</option>
                <option>LL.M (CL)</option>
                <option>LL.M (ADR)</option>
                <option>BBA - 1st Shift</option>
                <option>BBA - 2nd Shift</option>
                <option>B.Com (H)- 1st shift</option>
                <option>B.Com (H)- 2nd shift</option>
                <option>BA(JMC)- 1st shift</option>
                <option>BA(JMC)- 2nd shift</option>
                <option>MAMC</option>
                <option>BCA- 1st shift</option>
                <option>BCA- 2nd shift</option>
                <option>MCA</option>
                <option>BA ECO (H)- 1st shift</option>
                <option>BA ECO (H)- 2nd shift</option>
                <option>MA (ECONOMICS)</option>
                <option>BA ENGLISH (H)</option>
                <option>MA (ENGLISH)</option>
                <option>B.Tech CSE</option>
                <option>B.Tech AI&ML</option>
                <option>B.Tech AI&DS</option>
                <option>B.Tech IIOT</option>
                <option>B.Tech EE (VLSI Design & Technology)</option>
                <option>B.Tech CSE (Cyber Security)</option>
                <option>B.Tech CS(Applied Mathematics)</option>
                <option>B.Tech (LE)- Diploma Holders</option>
                <option>B.Tech (LE)- BSc Graduates</option>
              </select>
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
