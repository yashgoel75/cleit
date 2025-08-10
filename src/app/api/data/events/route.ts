import { NextResponse } from "next/server";
import { Society } from "../../../../../db/schema";
import { register } from "@/instrumentation";

interface Event {
    title: string,
    type: string,
    startDate: string,
    endDate: string,
    venue: string,
    time: string,
    about: string,
    socialGroup: string,
}
export async function GET() {
    try {
        await register();

        const societies = await Society.find({}, { events: 1, name: 1, username: 1 }).lean();

        const allEvents = societies.flatMap(society =>
            (society.events || []).map((event: Event) => ({
                ...event,
                societyName: society.name,
                societyUsername: society.username,
            }))
        );

        return NextResponse.json({ success: true, events: allEvents });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}