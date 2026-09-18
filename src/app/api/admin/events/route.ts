import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/database/db";
import { event } from "@/database/schema";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const authResult = await requireAdmin();

    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await db.select().from(event);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin();

    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

 const newEvent = await db
  .insert(event)
  .values({
    name: body.name,
    description: body.description || null,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
    location: body.location || null,
    category: body.category || null,
    googleFormLink: body.googleFormLink || null,
    bannerImage: body.bannerImage || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
