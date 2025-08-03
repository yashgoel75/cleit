"use client";

import Header from "@/app/Header/page";
import Footer from "@/app/Footer/page";
import { useEffect, useState } from "react";
import linkedin from "@/assets/LinkedIn.png";
import instagram from "@/assets/Instagram.png";
import Image from "next/image";

export function Account({ username }: { username: string }) {
  const [societyData, setSocietyData] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface EligibilityCriterion {
    name: string;
  }

  interface SocialLink {
    name: "LinkedIn" | "Instagram" | string;
    handle: string;
  }
  interface TeamMember {
    name: string;
    designation: string;
    mobile: string;
    email: string;
  }

  interface Event {
    _id: string;
    title: string;
    type?: string;
    venue: string;
    time: string;
    startDate: string;
    endDate?: string;
    about: string;
    socialGroup?: string;
  }

  interface Society {
    name: string;
    username: string;
    email: string;
    logo: string;
    website: string;
    about: string;
    auditionOpen: boolean;
    centralized: boolean;
    team: TeamMember[];
    events: Event[];
    social: SocialLink[];
    eligibility: EligibilityCriterion[];
    type: string;
  }

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const res = await fetch(
          `/api/society?username=${encodeURIComponent(username)}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch society");
        setSocietyData(data.society);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSociety();
  }, [username]);

  return (
    <>
      <Header />
      <main className="w-[95%] min-h-[85vh] lg:w-full max-w-6xl mx-auto py-10 md:py-16 px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <>
            <>
              <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-white">
                <div className="absolute top-[50%] left-0 w-full h-6 bg-red-500 z-0" />

                <h1 className="text-[120px] md:text-[160px] font-extrabold text-gray-900 z-10 relative leading-none">
                  404
                </h1>

                <p className="text-xl md:text-2xl text-red-600 font-medium mt-4 z-10 relative text-center px-4">
                  {error || "Something went wrong..."}
                </p>
              </div>
            </>
          </>
        ) : (
          <div className="space-y-10">
            <section className="text-center">
              <img
                src={societyData?.logo}
                alt={`${societyData?.name} logo`}
                className="mx-auto w-32 h-32 object-cover rounded-full border-2 border-indigo-700 shadow"
              />
              <h3 className="text-3xl font-bold mt-4">{societyData?.name}</h3>
              <p className="text-gray-600 text-lg">@{societyData?.username}</p>
              <p className="text-indigo-600 text-lg">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    societyData?.website?.startsWith("http")
                      ? societyData.website
                      : `https://${societyData?.website}`
                  }
                >
                  {societyData?.website?.replace(/^https?:\/\//, "")}
                </a>
              </p>
              <p className="text-gray-700 mt-2">{societyData?.about}</p>
              <p className="mt-2 text-sm font-medium">
                🎭 Auditions:&nbsp;
                <span
                  className={
                    societyData?.auditionOpen
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {societyData?.auditionOpen ? "Open" : "Closed"}
                </span>
              </p>
              <p className="text-sm font-medium">
                Centralized Society:&nbsp;
                <span
                  className={
                    societyData?.centralized ? "text-green-600" : "text-red-600"
                  }
                >
                  {societyData?.centralized ? "Yes" : "No"}
                </span>
              </p>
            </section>
            <section>
              <h4 className="flex items-center text-2xl font-semibold mb-4">
                About
              </h4>
              <div className="md:text-lg">{societyData?.about}</div>
            </section>

            <section>
              <h4 className="text-2xl font-semibold mb-4">Team Members</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {societyData?.team?.map((member: TeamMember, index: number) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl shadow-md p-6"
                  >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-base text-gray-600 mb-1">
                      <strong>Designation:</strong> {member.designation}
                    </p>
                    <p className="text-base text-gray-600 mb-1">
                      <strong>Mobile:</strong> {member.mobile}
                    </p>
                    <p className="text-base text-gray-600">
                      <strong>Email:</strong> {member.email}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h4 className="text-2xl font-semibold mb-4">Events</h4>
              {(societyData?.events?.length ?? 0 > 0) ? (
                (() => {
                  const now = new Date();
                  const events = societyData?.events;

                  const ongoing = events?.filter((event: Event) => {
                    const start = new Date(event.startDate);
                    const end = event.endDate ? new Date(event.endDate) : start;
                    return now >= start && now <= end;
                  });

                  const upcoming = events?.filter((event: Event) => {
                    const start = new Date(event.startDate);
                    return start > now;
                  });

                  const past = events?.filter((event: Event) => {
                    const end = event.endDate
                      ? new Date(event.endDate)
                      : new Date(event.startDate);
                    return end < now;
                  });

                  const renderEvents = (label: string, list: Event[]) =>
                    list.length > 0 && (
                      <>
                        <h5 className="text-xl font-semibold text-indigo-700 mt-6 mb-2">
                          {label}
                        </h5>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {list.map((event: Event) => (
                            <div
                              key={event._id}
                              className="bg-white border border-gray-200 rounded-xl shadow-md p-6"
                            >
                              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                {event.title}
                              </h3>
                              {event.type && (
                                <p className="text-base text-gray-600 mb-1">
                                  <strong>Type:</strong> {event.type}
                                </p>
                              )}
                              <p className="text-base text-gray-600 mb-1">
                                <strong>Venue:</strong> {event.venue}
                              </p>
                              <p className="text-base text-gray-600 mb-1">
                                <strong>Time:</strong> {event.time}
                              </p>
                              {event.endDate &&
                              event.endDate !== event.startDate ? (
                                <>
                                  <p className="text-base text-gray-600 mb-1">
                                    <strong>Start:</strong>&nbsp;
                                    {new Date(
                                      event.startDate,
                                    ).toLocaleDateString("en-IN")}
                                  </p>
                                  <p className="text-base text-gray-600 mb-1">
                                    <strong>End:</strong>&nbsp;
                                    {new Date(event.endDate).toLocaleDateString(
                                      "en-IN",
                                    )}
                                  </p>
                                </>
                              ) : (
                                <p className="text-base text-gray-600 mb-1">
                                  <strong>Date:</strong>&nbsp;
                                  {new Date(event.startDate).toLocaleDateString(
                                    "en-IN",
                                  )}
                                </p>
                              )}
                              <p className="text-base text-gray-600 mb-1 whitespace-pre-wrap">
                                <strong>About:</strong> {event.about}
                              </p>
                              {event.socialGroup && (
                                <p className="text-indigo-600 text-sm mt-2 break-all">
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                      event.socialGroup.startsWith("http")
                                        ? event.socialGroup
                                        : `https://${event.socialGroup}`
                                    }
                                  >
                                    {event.socialGroup.replace(
                                      /^https?:\/\//,
                                      "",
                                    )}
                                  </a>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    );

                  return (
                    <>
                      {renderEvents("Ongoing Events", ongoing || [])}
                      {renderEvents("Upcoming Events", upcoming || [])}
                      {renderEvents("Past Events", past || [])}
                    </>
                  );
                })()
              ) : (
                <p className="text-gray-500 italic">
                  No scheduled events right now. Stay tuned!
                </p>
              )}
            </section>

            <section>
              <h4 className="text-2xl font-semibold mb-4">Social Links</h4>
              <ul className="space-y-2">
                {societyData?.social?.map((s: SocialLink, i: number) => {
                  const icon = s.name === "LinkedIn" ? linkedin : instagram;
                  const handleUrl = s.handle.startsWith("http")
                    ? s.handle
                    : `https://${s.handle}`;
                  const username = s.handle
                    .replace(/\/+$/, "")
                    .split("/")
                    .pop();

                  return (
                    <li key={i} className="flex items-center gap-2 md:gap-3">
                      <Image
                        src={icon}
                        width={24}
                        height={24}
                        alt={`${s.name} icon`}
                      />
                      <span className="font-medium">{s.name}:</span>
                      <a
                        className="text-blue-600 underline break-all"
                        href={handleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{username}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section>
              <h4 className="text-2xl font-semibold mb-4">
                Eligibility Criteria
              </h4>
              {Array.isArray(societyData?.eligibility) &&
              societyData.eligibility.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {societyData.eligibility!.map(
                    (e: EligibilityCriterion, i: number) => (
                      <li key={i}>{e.name}</li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No specific eligibility criteria mentioned.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
