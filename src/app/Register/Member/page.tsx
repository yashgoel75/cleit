"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./page.css";
import Tooltip from "@/app/Tooltip/page";

export default function Member() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    startYear: "",
    endYear: "",
    department: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [falseUsernameFormat, setFalseUsernameFormat] = useState(false);
  const [falseEmailFormat, setFalseEmailFormat] = useState(false);
  const [falsePasswordFormat, setFalsePasswordFormat] = useState(false);
  const [falseConfirmPassword, setFalseConfirmPassword] = useState(false);
  const [falseEndYear, setFalseEndYear] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (
      updatedFormData.startYear &&
      updatedFormData.endYear &&
      Number(updatedFormData.endYear) <= Number(updatedFormData.startYear)
    ) {
      setFalseEndYear(true);
    } else {
      setFalseEndYear(false);
    }

    if (
      updatedFormData.password &&
      updatedFormData.confirmPassword &&
      updatedFormData.confirmPassword !== updatedFormData.password
    ) {
      setFalseConfirmPassword(true);
    } else {
      setFalseConfirmPassword(false);
    }

    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
    if (
      updatedFormData.username &&
      !usernameRegex.test(updatedFormData.username)
    ) {
      setFalseUsernameFormat(true);
    } else {
      setFalseUsernameFormat(false);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (updatedFormData.email && !emailRegex.test(updatedFormData.email)) {
      setFalseEmailFormat(true);
    } else {
      setFalseEmailFormat(false);
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (
      updatedFormData.password &&
      !passwordRegex.test(updatedFormData.password)
    ) {
      setFalsePasswordFormat(true);
    } else {
      setFalsePasswordFormat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/register/member", formData);
      if (res.status === 200) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/Dashboard"), 1500);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[98%] md:w-1/2 mx-auto font-sans">
      <div className="border border-gray-300 p-6 rounded-xl shadow-md bg-white mb-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Member Registration
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <div className="flex items-center">
              <div>
                <label className="block mb-1 text-gray-700 font-medium mr-1">
                  Username
                </label>
              </div>
              <div>
                <Tooltip
                  content="Username must be 3–20 characters long and can only contain letters, numbers, dot, or underscores"
                  position="top"
                >
                  <svg
                    className="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="#141414"
                  >
                    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-600">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="yourusername"
                className="flex-1 py-2 outline-none"
              />
              <button
                type="button"
                className="bg-indigo-500 w-[20%] outline-none text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 hover:cursor-pointer"
              >
                Check
              </button>
            </div>
          </div>
          {falseUsernameFormat ? (
            <div className="flex justify-center items-center bg-red-300 text-red-800 rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#992B15"
              >
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
              </svg>
              &nbsp; Please enter a valid username
            </div>
          ) : null}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 outline-none"
              />
              <button
                type="button"
                className="bg-indigo-500 w-[20%] outline-none text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 hover:cursor-pointer"
              >
                Send OTP
              </button>
            </div>
          </div>
          {falseEmailFormat ? (
            <div className="flex justify-center items-center bg-red-300 text-red-800 rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#992B15"
              >
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
              </svg>
              &nbsp; Please enter a valid email address
            </div>
          ) : null}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Enter OTP
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="text"
                placeholder="123456"
                className="flex-1 px-4 py-2 outline-none"
              />
              <button
                type="button"
                className="bg-indigo-500 outline-none w-[20%] text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 hover:cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="mr-1">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Password
                  </label>
                </div>
                <div>
                  <Tooltip
                    content="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, #, $, !, %, *, ?, &)."
                    position="top"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#141414"
                    >
                      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set your password"
                  className="w-full px-4 py-2 outline-none"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
          </div>
          {falsePasswordFormat ? (
            <div className="flex justify-center items-center bg-red-300 text-red-800 rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#992B15"
              >
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
              </svg>
              &nbsp; Please enter a valid password format
            </div>
          ) : null}
          {falseConfirmPassword ? (
            <div className="flex justify-center items-center bg-red-300 text-red-800 rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#992B15"
              >
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
              </svg>
              &nbsp; Passwords do not match.
            </div>
          ) : null}
          {/* <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div> */}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">
                Start Year
              </label>
              <input
                type="number"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                placeholder="2023"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">
                End Year
              </label>
              <input
                type="number"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                placeholder="2027"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
          </div>
          {falseEndYear ? (
            <div className="flex justify-center items-center bg-red-300 text-red-800 rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#992B15"
              >
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
              </svg>
              &nbsp; Graduation end year must be later than the start year.{" "}
            </div>
          ) : null}

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Department & Branch
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="">Select...</option>
              {[
                "BALLB (H)",
                "BBALLB (H)",
                "LL.M (CL)",
                "LL.M (ADR)",
                "BBA - 1st Shift",
                "BBA - 2nd Shift",
                "B.Com (H)- 1st shift",
                "B.Com (H)- 2nd shift",
                "BA(JMC)- 1st shift",
                "BA(JMC)- 2nd shift",
                "MAMC",
                "BCA- 1st shift",
                "BCA- 2nd shift",
                "MCA",
                "BA ECO (H)- 1st shift",
                "BA ECO (H)- 2nd shift",
                "MA (ECONOMICS)",
                "BA ENGLISH (H)",
                "MA (ENGLISH)",
                "B.Tech CSE",
                "B.Tech AI&ML",
                "B.Tech AI&DS",
                "B.Tech IIOT",
                "B.Tech EE (VLSI Design & Technology)",
                "B.Tech CSE (Cyber Security)",
                "B.Tech CS(Applied Mathematics)",
                "B.Tech (LE)- Diploma Holders",
                "B.Tech (LE)- BSc Graduates",
              ].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-500 text-white px-6 py-2 rounded-md font-semibold transition hover:bg-indigo-700 hover:cursor-pointer ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Register Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
