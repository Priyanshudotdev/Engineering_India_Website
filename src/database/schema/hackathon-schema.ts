import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { event } from "./event-schema";
import { user } from "./auth-schema";

export const hackathon = sqliteTable("hackathon", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),

  eventId: text("event_id"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Team Information
  teamName: text("team_name").notNull(),

  // Team Leader Information
  teamLeaderName: text("team_leader_name").notNull(),
  teamLeaderEmail: text("team_leader_email").notNull(),
  teamLeaderPhone: text("team_leader_phone").notNull(),
  teamLeaderGender: text("team_leader_gender").notNull(),

  // Institute Information
  institute: text("institute").notNull(),
  branch: text("branch").notNull(), // Engineering branch
  year: text("year").notNull(),

  // Team Members (JSON stringified array of member objects)
  // Each member: { name, email, phone, gender, branch, year }
  teamMembers: text("team_members"), // JSON array

  // Payment Information
  paymentScreenshot: text("payment_screenshot"), // File path/URL
  transactionId: text("transaction_id"),

  // Declaration
  declarationAccepted: integer("declaration_accepted", {
    mode: "boolean",
  }).notNull(),

  // Status
  status: text("status").notNull().default("pending"), // pending | verified | rejected

  // Round 1 Submission (PPT Upload)
  round1PptUrl: text("round1_ppt_url"), // URL to uploaded PPT
  round1SubmittedAt: integer("round1_submitted_at", { mode: "timestamp" }), // Submission timestamp
  round1Status: text("round1_status").default("not_submitted"), // not_submitted | submitted | reviewed

  // Round 2 Selection
 round2Qualified: integer("round2_qualified", { mode: "boolean" })
  .notNull()
  .default(false),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
