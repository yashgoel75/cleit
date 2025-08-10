"use client";

import Header from "../Header/page";
import Footer from "../Footer/page";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

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
  contact: Array<{
    name: string;
    designation: string;
    mobile: string;
    email: string;
  }>;
  socialGroup: string;
}

interface SortConfig {
  key: keyof Event | "";
  direction: "asc" | "desc" | "";
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "",
  });

  useEffect(() => {
    async function getEvents() {
      try {
        const res = await fetch("/api/data/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch events");
        setEvents(data.events as Event[]);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Unexpected error");
      }
    }
    getEvents();
  }, []);

  const today = new Date();

  const sortEvents = (arr: Event[]) => {
    if (!sortConfig.key) return arr;
    return [...arr].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const key = sortConfig.key as keyof Event;
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      if (typeof key === "string" && key.includes("Date")) {
        return sortConfig.direction === "asc"
          ? new Date(aValue as string).getTime() -
              new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() -
              new Date(aValue as string).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const requestSort = (key: keyof Event) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      Object.values(event)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [events, search]);

  const pastEvents = filteredEvents.filter((event) => {
    const end = event.endDate
      ? new Date(event.endDate)
      : new Date(event.startDate);
    return end < today;
  });

  const ongoingEvents = filteredEvents.filter((event) => {
    if (!event.endDate) return false;
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return start <= today && end >= today;
  });

  const upcomingEvents = filteredEvents.filter((event) => {
    const start = new Date(event.startDate);
    return start > today;
  });

  const renderTable = (data: Event[], title: string) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {[
                  { label: "Title", key: "title" as keyof Event },
                  { label: "Start Date", key: "startDate" as keyof Event },
                  { label: "End Date", key: "endDate" as keyof Event },
                  { label: "Time", key: "time" as keyof Event },
                  { label: "Venue", key: "venue" as keyof Event },
                  { label: "Society", key: "societyName" as keyof Event },
                  { label: "Actions", key: "" as keyof Event },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={`py-3 px-4 ${
                      col.key ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={() => col.key && requestSort(col.key)}
                  >
                    {col.label}
                    {sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortEvents(data).map((event) => (
                <tr key={event._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">{event.startDate}</td>
                  <td className="py-3 px-4">{event.endDate || "-"}</td>
                  <td className="py-3 px-4">{event.time}</td>
                  <td className="py-3 px-4">{event.venue}</td>
                  <td className="py-3 px-4">{event.societyName}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/events/${event._id}`}
                      className="text-indigo-600 hover:underline focus:outline-none"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 min-h-[85vh]">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Event Calendar</h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search events..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {renderTable(upcomingEvents, "Upcoming Events")}
        {renderTable(ongoingEvents, "Ongoing Events")}
        {renderTable(pastEvents, "Past Events")}
      </main>
      <Footer />
    </>
  );
}
