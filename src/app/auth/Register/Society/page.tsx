"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Tooltip from "@/app/Tooltip/page";

export default function Society() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [falseUsernameFormat, setFalseUsernameFormat] = useState(false);
  const [falseEmailFormat, setFalseEmailFormat] = useState(false);
  const [falsePasswordFormat, setFalsePasswordFormat] = useState(false);
  const [falseConfirmPassword, setFalseConfirmPassword] = useState(false);

  const [invalidOtp, setInvalidOtp] = useState(false);
  const [validOtp, setValidOtp] = useState(false);

  const [usernameAlreadyTaken, setUsernameAlreadyTaken] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailAlreadyTaken, setEmailAlreadyTaken] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setUsernameAvailable(false);
      setUsernameAlreadyTaken(false);
    }
    if (name === "email") {
      setEmailAlreadyTaken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const res = await axios.post("/api/register/society", formData);
      if (res.status === 200) {
        setSuccess("Society registered successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function isUsernameAvailable() {
    try {
      const res = await fetch(
        `/api/register/society?username=${formData.username}`
      );
      const data = await res.json();

      if (data.usernameExists) {
        setUsernameAvailable(false);
        setUsernameAlreadyTaken(true);
      } else {
        setUsernameAlreadyTaken(false);
        setUsernameAvailable(true);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  }

  async function isEmailAvailable() {
    try {
      const res = await fetch(`/api/register/society?email=${formData.email}`);
      const data = await res.json();

      if (data.emailExists) {
        setEmailAlreadyTaken(true);
      } else {
        setEmailAlreadyTaken(false);
      }
    } catch (error) {
      console.log("Error checking email:", error);
    }
  }


  useEffect(() => {
    const { username, email, password, confirmPassword } = formData;

    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
    setFalseUsernameFormat(username ? !usernameRegex.test(username) : false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setFalseEmailFormat(email ? !emailRegex.test(email) : false);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    setFalsePasswordFormat(password ? !passwordRegex.test(password) : false);

    setFalseConfirmPassword(
      !!confirmPassword && !!password && confirmPassword !== password
    );
  }, [formData]);

  return (
    <div className="w-[98%] md:w-1/2 mx-auto font-sans">
      <div className="border border-gray-300 p-6 rounded-xl shadow-md bg-white mb-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Society Registration
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Society Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter society name"
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
                onClick={() => {
                  isUsernameAvailable();
                }}
                disabled={falseUsernameFormat}
                className={`bg-indigo-500 outline-none w-[20%] text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 ${
                  falseUsernameFormat
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
              >
                Check
              </button>
            </div>
          </div>
          {usernameAlreadyTaken ? (
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
              &nbsp; Username already taken
            </div>
          ) : null}
          {usernameAvailable ? (
            <div className="flex justify-center items-center bg-green-300 text-[#408118ff] rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#408118ff"
              >
                <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
              </svg>
              &nbsp; Username available
            </div>
          ) : null}
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
                onClick={() => isEmailAvailable()}
                className="bg-indigo-500 outline-none w-[20%] text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 hover:cursor-pointer"
              >
                Send OTP
              </button>
            </div>
          </div>
          {emailAlreadyTaken ? (
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
              &nbsp; Email ID already in use
            </div>
          ) : null}
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
          {invalidOtp ? (
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
              &nbsp; The entered OTP is invalid. Kindly verify and re-enter.
            </div>
          ) : null}
          {validOtp ? (
            <div className="flex justify-center items-center bg-green-300 text-[#408118ff] rounded px-3 text-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#408118ff"
              >
                <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
              </svg>
              &nbsp; OTP verified successfully
            </div>
          ) : null}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium mr-1">
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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set your password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
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
                placeholder="Cofirm password"
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
            <label className="block mb-1 text-gray-700 font-medium">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div> */}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-500 outline-none text-white px-6 py-2 rounded-md font-semibold transition hover:bg-indigo-700 hover:cursor-pointer ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Registering..." : "Register Society"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
