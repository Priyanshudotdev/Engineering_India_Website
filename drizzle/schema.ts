import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const account = sqliteTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at"),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	token: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	uniqueIndex("session_token_unique").on(table.token),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer("email_verified").notNull(),
	image: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	role: text().default("USER").notNull(),
	phone: text(),
	collegeName: text("college_name"),
	year: text(),
	branch: text(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

export const verification = sqliteTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const event = sqliteTable("event", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	startDate: integer("start_date"),
	endDate: integer("end_date"),
	timeline: text(),
	prizes: text(),
	faqs: text(),
	organizerContact: text("organizer_contact"),
	coOrganizerContact: text("co_organizer_contact"),
	discordLink: text("discord_link"),
	whatsappLink: text("whatsapp_link"),
	bannerImage: text("banner_image"),
	gallery: text(),
	details: text(),
	rules: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	location: text(),
	category: text(),
	registrationFee: text("registration_fee"),
});

export const payment = sqliteTable("payment", {
	id: text().primaryKey().notNull(),
	registrationId: text("registration_id").notNull().references(() => registration.id, { onDelete: "cascade" } ),
	transactionId: text("transaction_id"),
	senderName: text("sender_name"),
	amount: text().notNull(),
	verified: integer().default(false).notNull(),
	verifiedBy: text("verified_by").references(() => user.id),
	verifiedAt: integer("verified_at"),
	paymentDate: integer("payment_date"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	rejected: integer().default(false).notNull(),
	createdAt: integer("created_at"),
});

export const registration = sqliteTable("registration", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	teamId: text("team_id"),
	formData: text("form_data"),
	status: text().default("pending").notNull(),
	registeredAt: integer("registered_at").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const ticket = sqliteTable("ticket", {
	id: text().primaryKey().notNull(),
	registrationId: text("registration_id").notNull().references(() => registration.id),
	ticketCode: text("ticket_code").notNull(),
	qrCode: text("qr_code"),
	generatedAt: integer("generated_at").notNull(),
},
(table) => [
	uniqueIndex("ticket_ticket_code_unique").on(table.ticketCode),
]);

export const feedback = sqliteTable("feedback", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	createdAt: integer("created_at").notNull(),
});

export const membershipForm = sqliteTable("membership_form", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	year: text().notNull(),
	branch: text().notNull(),
	email: text().notNull(),
	areaOfInterest: text("area_of_interest"),
	engagedInOtherClub: integer("engaged_in_other_club").notNull(),
	previousExperience: text("previous_experience"),
	reasonToJoin: text("reason_to_join").notNull(),
	eventIdeas: text("event_ideas"),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	uniqueIndex("membership_form_email_unique").on(table.email),
]);

export const eventForm = sqliteTable("event_form", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	formSchema: text("form_schema").notNull(),
	title: text(),
	description: text(),
	successMessage: text("success_message").default("Thank you for registering!"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	formImage: text("form_image"),
});

export const formAnalytics = sqliteTable("form_analytics", {
	id: text().primaryKey().notNull(),
	formId: text("form_id").notNull().references(() => eventForm.id, { onDelete: "cascade" } ),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	views: integer().default(0).notNull(),
	submissions: integer().default(0).notNull(),
	date: text().notNull(),
	createdAt: integer("created_at").notNull(),
});

export const formSubmission = sqliteTable("form_submission", {
	id: text().primaryKey().notNull(),
	formId: text("form_id").notNull().references(() => eventForm.id, { onDelete: "cascade" } ),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	userId: text("user_id"),
	responses: text().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	status: text().default("pending").notNull(),
	adminNotes: text("admin_notes"),
	submittedAt: integer("submitted_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const blog = sqliteTable("blog", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	excerpt: text(),
	content: text().notNull(),
	coverImage: text("cover_image"),
	author: text(),
	authorId: text("author_id").references(() => user.id, { onDelete: "set null" } ),
	category: text(),
	tags: text(),
	isPublished: integer("is_published").default(false).notNull(),
	publishedAt: integer("published_at"),
	viewCount: integer("view_count").default(0).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const blogComment = sqliteTable("blog_comment", {
	id: text().primaryKey().notNull(),
	blogId: text("blog_id").notNull().references(() => blog.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" } ),
	content: text().notNull(),
	isApproved: integer("is_approved").default(false).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const eventFaq = sqliteTable("event_faq", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	categoryId: text("category_id").references(() => eventFaqCategory.id, { onDelete: "set null" } ),
	question: text().notNull(),
	answer: text().notNull(),
	order: integer().default(0),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const eventFaqCategory = sqliteTable("event_faq_category", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	order: integer().default(0),
	createdAt: integer("created_at").notNull(),
});

export const eventPaymentConfig = sqliteTable("event_payment_config", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	paymentRequired: integer("payment_required").default(false).notNull(),
	amount: text(),
	currency: text().default("INR"),
	upiIds: text("upi_ids").default("[]"),
	qrCodeUrl: text("qr_code_url"),
	bankDetails: text("bank_details"),
	paymentInstructions: text("payment_instructions"),
	paymentDeadline: integer("payment_deadline"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const eventPhase = sqliteTable("event_phase", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	description: text(),
	phaseNumber: integer("phase_number").notNull(),
	startDate: integer("start_date"),
	endDate: integer("end_date"),
	isActive: integer("is_active").default(false).notNull(),
	requiresPreviousPhase: integer("requires_previous_phase").default(true),
	instructions: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const eventResource = sqliteTable("event_resource", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	type: text().notNull(),
	fileUrl: text("file_url").notNull(),
	fileName: text("file_name").notNull(),
	fileSize: integer("file_size"),
	accessLevel: text("access_level").default("public").notNull(),
	phaseId: text("phase_id"),
	order: integer().default(0),
	uploadedBy: text("uploaded_by").references(() => user.id),
	downloadCount: integer("download_count").default(0),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const phaseForm = sqliteTable("phase_form", {
	id: text().primaryKey().notNull(),
	phaseId: text("phase_id").notNull().references(() => eventPhase.id, { onDelete: "cascade" } ),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	formSchema: text("form_schema").notNull(),
	allowMultiple: integer("allow_multiple").default(false),
	submissionDeadline: integer("submission_deadline"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const phaseSubmission = sqliteTable("phase_submission", {
	id: text().primaryKey().notNull(),
	phaseFormId: text("phase_form_id").notNull().references(() => phaseForm.id, { onDelete: "cascade" } ),
	phaseId: text("phase_id").notNull().references(() => eventPhase.id, { onDelete: "cascade" } ),
	eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" } ),
	registrationId: text("registration_id").notNull().references(() => registration.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	responses: text().notNull(),
	fileUrls: text("file_urls"),
	status: text().default("submitted").notNull(),
	score: integer(),
	feedback: text(),
	reviewedBy: text("reviewed_by").references(() => user.id),
	reviewedAt: integer("reviewed_at"),
	submittedAt: integer("submitted_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const hackathon = sqliteTable("hackathon", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	teamName: text("team_name").notNull(),
	teamLeaderName: text("team_leader_name").notNull(),
	teamLeaderEmail: text("team_leader_email").notNull(),
	teamLeaderPhone: text("team_leader_phone").notNull(),
	teamLeaderGender: text("team_leader_gender").notNull(),
	institute: text().notNull(),
	branch: text().notNull(),
	year: text().notNull(),
	teamMembers: text("team_members"),
	paymentScreenshot: text("payment_screenshot"),
	transactionId: text("transaction_id"),
	declarationAccepted: integer("declaration_accepted").notNull(),
	status: text().default("pending").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	round1PptUrl: text("round1_ppt_url"),
	round1SubmittedAt: integer("round1_submitted_at"),
	round1Status: text("round1_status").default("not_submitted"),
});

export const hackathonFeedback = sqliteTable("hackathon_feedback", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	college: text().notNull(),
	branch: text().notNull(),
	year: text().notNull(),
	overallRating: integer("overall_rating").notNull(),
	experienceRating: integer("experience_rating").notNull(),
	organizationRating: integer("organization_rating").notNull(),
	whatYouLiked: text("what_you_liked"),
	improvements: text(),
	suggestions: text(),
	wouldRecommend: integer("would_recommend").notNull(),
	venueRating: integer("venue_rating"),
	foodRating: integer("food_rating"),
	mentorshipRating: integer("mentorship_rating"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

