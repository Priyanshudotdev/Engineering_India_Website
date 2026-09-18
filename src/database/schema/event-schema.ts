import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { v4 as uuid } from "uuid";

export const event = sqliteTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  timeline: text("timeline"),
  prizes: text("prizes"), // JSON stringified array
  registrationFee: text("registration_fee"), // Registration fee amount
  faqs: text("faqs"), // JSON stringified array of Q&A
  organizerContact: text("organizer_contact"),
  coOrganizerContact: text("co_organizer_contact"),
  discordLink: text("discord_link"),
  whatsappLink: text("whatsapp_link"),
  googleFormLink: text("google_form_link"),
  bannerImage: text("banner_image"),
  gallery: text("gallery"), // JSON stringified array of images
  details: text("details"),
  rules: text("rules"),
  location: text("location"),
  category: text("category"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const registration = sqliteTable("registration", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  teamId: text("team_id"), // Optional, for team events
  formData: text("form_data"), // JSON stringified form
  status: text("status").notNull().default("pending"), // pending | verified | rejected
  registeredAt: integer("registered_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const payment = sqliteTable("payment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),

  registrationId: text("registration_id")
    .notNull()
    .references(() => registration.id, { onDelete: "cascade" }),

  transactionId: text("transaction_id"),
  senderName: text("sender_name"),
  amount: text("amount").notNull(), // Ensure amount is always present

  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  rejected: integer("rejected", { mode: "boolean" }).notNull().default(false),

  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),

  paymentDate: integer("payment_date", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const ticket = sqliteTable("ticket", {
  id: text("id").primaryKey(),
  registrationId: text("registration_id")
    .notNull()
    .references(() => registration.id),
  ticketCode: text("ticket_code").notNull().unique(), // You can generate UUID or hex code
  qrCode: text("qr_code"),
  generatedAt: integer("generated_at", { mode: "timestamp" }).notNull(),
});
