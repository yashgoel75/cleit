"use client";

import Header from "@/app/Header/page";
import Footer from "@/app/Footer/page";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Contact {
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  type: string;
  startDate: string;
  endDate?: string;
  time: string;
  venue: string;
  about: string;
  societyName: string;
  societyUsername: string;
  contact: Contact[];
  socialGroup: string;
}

interface Society {
  name: string;
  username: string;
  logo: string;
  email: string;
  about: string;
  website: string;
}

export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch events");

        const foundEvent = (data.events as Event[]).find(
          (e) => e._id === eventId,
        );
        setEvent(foundEvent || null);

        if (foundEvent) {
          const societyRes = await fetch(
            `/api/data/society?username=${foundEvent.societyUsername}`,
          );
          const societyData = await societyRes.json();
          if (!societyRes.ok)
            throw new Error(societyData.error || "Failed to fetch society");
          console.log(societyData);
          setSociety(societyData.data[0] as Society);
          console.log(societyData.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchData();
  }, [eventId]);

  return (
    <>
      <Header />
      <main className="flex justify-center items-center min-h-[85vh] px-4 py-12">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : !event ? (
          <p className="text-gray-500 text-center">Event not found.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl w-full">
            {society && (
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <img
                    src={society?.logo}
                    alt={`${society?.name} logo`}
                    className="mx-auto w-32 h-32 object-cover rounded-full border-2 border-indigo-700 shadow"
                  />
                </div>
                <div>
                  <Link
                    href={`/org/${society.username}`}
                    className="text-lg font-semibold text-indigo-600 hover:underline"
                  >
                    {society.name}
                  </Link>
                  {society.website && (
                    <p className="text-sm text-gray-500">
                      <a
                        href={
                          society.website.startsWith("http")
                            ? society.website
                            : `https://${society.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {society.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.type}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-6">
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {event.startDate}
              </p>
              {event.endDate && (
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {event.endDate}
                </p>
              )}
              <p>
                <span className="font-semibold">Time:</span> {event.time}
              </p>
              <p>
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
            </div>

            {event.about && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{event.about}</p>
              </div>
            )}

            {event.contact.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Contacts</h2>
                <ul className="space-y-3">
                  {event.contact.map((c, idx) => (
                    <li key={idx} className="border p-3 rounded-md">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.designation}</p>
                      {c.mobile && (
                        <p>
                          <span className="font-semibold">Mobile:</span>{" "}
                          {c.mobile}
                        </p>
                      )}
                      {c.email && (
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {c.email}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {event.socialGroup && (
              <div className="mb-4">
                <p className="font-semibold">Join Social Group:</p>
                <a
                  href={
                    event.socialGroup.startsWith("http")
                      ? event.socialGroup
                      : `https://${event.socialGroup}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-all"
                >
                  {event.socialGroup}
                </a>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
