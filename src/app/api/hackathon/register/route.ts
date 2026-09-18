import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/database/db";
import { hackathon } from "@/database/schema/hackathon-schema";
import { registration, event } from "@/database/schema";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { syncToGoogleSheets } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    // HACKATHON REGISTRATIONS ARE CLOSED
    return NextResponse.json(
      { error: "Hackathon registrations are closed." },
      { status: 403 },
    );

    /* UNREACHABLE CODE - Registration is closed */
    /*
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to register." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const body = await request.json();

    // Extract form fields
    const {
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      teamLeaderPhone,
      teamLeaderGender,
      institute,
      branch,
      year,
      teamMembers: teamMembersJson,
      transactionId,
      declarationAccepted,
      paymentScreenshotUrl,
    } = body;

    // Validation
    if (
      !teamName ||
      !teamLeaderName ||
      !teamLeaderEmail ||
      !teamLeaderPhone ||
      !teamLeaderGender ||
      !institute ||
      !branch ||
      !year ||
      !declarationAccepted
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(teamLeaderEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate phone format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(teamLeaderPhone)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingEmailRegistration = await db
      .select()
      .from(hackathon)
      .where(eq(hackathon.teamLeaderEmail, teamLeaderEmail))
      .limit(1);

    if (existingEmailRegistration.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 },
      );
    }

    // Check if team name already exists
    const existingTeamRegistration = await db
      .select()
      .from(hackathon)
      .where(eq(hackathon.teamName, teamName))
      .limit(1);

    if (existingTeamRegistration.length > 0) {
      return NextResponse.json(
        {
          error:
            "This team name is already taken. Please choose a different name.",
        },
        { status: 400 },
      );
    }

    // Parse and validate team members
    let teamMembers = [];
    try {
      teamMembers = JSON.parse(teamMembersJson || "[]");

      // Validate team size (2-4 including leader)
      const totalTeamSize = teamMembers.length + 1;
      if (totalTeamSize < 2 || totalTeamSize > 4) {
        return NextResponse.json(
          {
            error:
              "Team size must be between 2 and 4 members (including leader)",
          },
          { status: 400 },
        );
      }

      // Validate each team member
      for (const member of teamMembers) {
        if (
          !member.name ||
          !member.email ||
          !member.phone ||
          !member.gender ||
          !member.branch ||
          !member.year
        ) {
          return NextResponse.json(
            {
              error:
                "All team members must have name, email, phone, gender, branch, and year",
            },
            { status: 400 },
          );
        }

        if (!emailRegex.test(member.email)) {
          return NextResponse.json(
            { error: `Invalid email format for team member: ${member.name}` },
            { status: 400 },
          );
        }

        if (!phoneRegex.test(member.phone)) {
          return NextResponse.json(
            { error: `Invalid phone number for team member: ${member.name}` },
            { status: 400 },
          );
        }
      }

      // Check for duplicate emails within team
      const allEmails = [
        teamLeaderEmail,
        ...teamMembers.map((m: { email: string }) => m.email),
      ];
      const uniqueEmails = new Set(allEmails);
      if (uniqueEmails.size !== allEmails.length) {
        return NextResponse.json(
          { error: "Duplicate emails found within the team" },
          { status: 400 },
        );
      }
    } catch (_error) {
      return NextResponse.json(
        { error: "Invalid team members data" },
        { status: 400 },
      );
    }

    // Validate payment screenshot URL
    if (!paymentScreenshotUrl) {
      return NextResponse.json(
        { error: "Payment screenshot is required" },
        { status: 400 },
      );
    }

    // Insert into database
    const now = new Date();
    const registrationId = uuid();
    const hackathonRegistrationId = uuid();

    // First, check if a hackathon event exists in the event table
    let hackathonEventId: string;
    const hackathonEvents = await db
      .select()
      .from(event)
      .where(eq(event.name, "Hackathon 2025"))
      .limit(1);

    if (hackathonEvents.length > 0 && hackathonEvents[0]) {
      hackathonEventId = hackathonEvents[0].id;
    } else {
      // Create a hackathon event entry if it doesn't exist
      hackathonEventId = uuid();
      await db.insert(event).values({
        id: hackathonEventId,
        name: "Hackathon 2025",
        description:
          "Annual Hackathon Competition - Build innovative solutions and compete with the best teams",
        category: "Competition",
        location: "TBD",
        startDate: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Insert into hackathon table (detailed registration)
    await db.insert(hackathon).values({
      id: hackathonRegistrationId,
      eventId: hackathonEventId,
      userId,
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      teamLeaderPhone,
      teamLeaderGender,
      institute,
      branch,
      year,
      teamMembers: teamMembersJson,
      paymentScreenshot: paymentScreenshotUrl,
      transactionId: transactionId || null,
      declarationAccepted:
        declarationAccepted === "true" || declarationAccepted === true,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Also insert into registration table (for unified registration tracking)
    await db.insert(registration).values({
      id: registrationId,
      eventId: hackathonEventId,
      userId,
      teamId: hackathonRegistrationId, // Link to hackathon registration
      formData: JSON.stringify({
        teamName,
        teamLeaderName,
        teamLeaderEmail,
        teamLeaderPhone,
        institute,
        branch,
        year,
        teamMembers: teamMembersJson,
      }),
      status: "pending",
      registeredAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Sync to Google Sheets (async, non-blocking)
    // Parse team members for Google Sheets
    const parsedTeamMembers = JSON.parse(teamMembersJson);
    syncToGoogleSheets({
      registrationId,
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      teamLeaderPhone,
      teamLeaderGender,
      institute,
      branch,
      year,
      teamMembers: parsedTeamMembers,
      transactionId,
      paymentScreenshotUrl,
      status: "pending",
      registeredAt: now,
    }).catch((error) => {
      // Log but don't fail the registration if Google Sheets sync fails
      console.error("Google Sheets sync failed:", error);
    });

    // TODO: Send confirmation email to team leader
    // You can implement email sending here using nodemailer or another service

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        registrationId,
        hackathonRegistrationId,
      },
      { status: 201 },
    );
    */
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
