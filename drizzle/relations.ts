import { relations } from "drizzle-orm/relations";
import { user, account, session, payment, registration, event, ticket, membershipForm, eventForm, formAnalytics, formSubmission, blog, blogComment, eventFaqCategory, eventFaq, eventPaymentConfig, eventPhase, eventResource, phaseForm, phaseSubmission, hackathon } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	payments_verifiedBy: many(payment, {
		relationName: "payment_verifiedBy_user_id"
	}),
	payments_userId: many(payment, {
		relationName: "payment_userId_user_id"
	}),
	registrations: many(registration),
	membershipForms: many(membershipForm),
	blogs: many(blog),
	blogComments: many(blogComment),
	eventResources: many(eventResource),
	phaseSubmissions_reviewedBy: many(phaseSubmission, {
		relationName: "phaseSubmission_reviewedBy_user_id"
	}),
	phaseSubmissions_userId: many(phaseSubmission, {
		relationName: "phaseSubmission_userId_user_id"
	}),
	hackathons: many(hackathon),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	user_verifiedBy: one(user, {
		fields: [payment.verifiedBy],
		references: [user.id],
		relationName: "payment_verifiedBy_user_id"
	}),
	registration: one(registration, {
		fields: [payment.registrationId],
		references: [registration.id]
	}),
	event: one(event, {
		fields: [payment.eventId],
		references: [event.id]
	}),
	user_userId: one(user, {
		fields: [payment.userId],
		references: [user.id],
		relationName: "payment_userId_user_id"
	}),
}));

export const registrationRelations = relations(registration, ({one, many}) => ({
	payments: many(payment),
	user: one(user, {
		fields: [registration.userId],
		references: [user.id]
	}),
	event: one(event, {
		fields: [registration.eventId],
		references: [event.id]
	}),
	tickets: many(ticket),
	phaseSubmissions: many(phaseSubmission),
}));

export const eventRelations = relations(event, ({many}) => ({
	payments: many(payment),
	registrations: many(registration),
	eventForms: many(eventForm),
	formAnalytics: many(formAnalytics),
	formSubmissions: many(formSubmission),
	eventFaqs: many(eventFaq),
	eventFaqCategories: many(eventFaqCategory),
	eventPaymentConfigs: many(eventPaymentConfig),
	eventPhases: many(eventPhase),
	eventResources: many(eventResource),
	phaseForms: many(phaseForm),
	phaseSubmissions: many(phaseSubmission),
}));

export const ticketRelations = relations(ticket, ({one}) => ({
	registration: one(registration, {
		fields: [ticket.registrationId],
		references: [registration.id]
	}),
}));

export const membershipFormRelations = relations(membershipForm, ({one}) => ({
	user: one(user, {
		fields: [membershipForm.userId],
		references: [user.id]
	}),
}));

export const eventFormRelations = relations(eventForm, ({one, many}) => ({
	event: one(event, {
		fields: [eventForm.eventId],
		references: [event.id]
	}),
	formAnalytics: many(formAnalytics),
	formSubmissions: many(formSubmission),
}));

export const formAnalyticsRelations = relations(formAnalytics, ({one}) => ({
	event: one(event, {
		fields: [formAnalytics.eventId],
		references: [event.id]
	}),
	eventForm: one(eventForm, {
		fields: [formAnalytics.formId],
		references: [eventForm.id]
	}),
}));

export const formSubmissionRelations = relations(formSubmission, ({one}) => ({
	event: one(event, {
		fields: [formSubmission.eventId],
		references: [event.id]
	}),
	eventForm: one(eventForm, {
		fields: [formSubmission.formId],
		references: [eventForm.id]
	}),
}));

export const blogRelations = relations(blog, ({one, many}) => ({
	user: one(user, {
		fields: [blog.authorId],
		references: [user.id]
	}),
	blogComments: many(blogComment),
}));

export const blogCommentRelations = relations(blogComment, ({one}) => ({
	user: one(user, {
		fields: [blogComment.userId],
		references: [user.id]
	}),
	blog: one(blog, {
		fields: [blogComment.blogId],
		references: [blog.id]
	}),
}));

export const eventFaqRelations = relations(eventFaq, ({one}) => ({
	eventFaqCategory: one(eventFaqCategory, {
		fields: [eventFaq.categoryId],
		references: [eventFaqCategory.id]
	}),
	event: one(event, {
		fields: [eventFaq.eventId],
		references: [event.id]
	}),
}));

export const eventFaqCategoryRelations = relations(eventFaqCategory, ({one, many}) => ({
	eventFaqs: many(eventFaq),
	event: one(event, {
		fields: [eventFaqCategory.eventId],
		references: [event.id]
	}),
}));

export const eventPaymentConfigRelations = relations(eventPaymentConfig, ({one}) => ({
	event: one(event, {
		fields: [eventPaymentConfig.eventId],
		references: [event.id]
	}),
}));

export const eventPhaseRelations = relations(eventPhase, ({one, many}) => ({
	event: one(event, {
		fields: [eventPhase.eventId],
		references: [event.id]
	}),
	phaseForms: many(phaseForm),
	phaseSubmissions: many(phaseSubmission),
}));

export const eventResourceRelations = relations(eventResource, ({one}) => ({
	user: one(user, {
		fields: [eventResource.uploadedBy],
		references: [user.id]
	}),
	event: one(event, {
		fields: [eventResource.eventId],
		references: [event.id]
	}),
}));

export const phaseFormRelations = relations(phaseForm, ({one, many}) => ({
	event: one(event, {
		fields: [phaseForm.eventId],
		references: [event.id]
	}),
	eventPhase: one(eventPhase, {
		fields: [phaseForm.phaseId],
		references: [eventPhase.id]
	}),
	phaseSubmissions: many(phaseSubmission),
}));

export const phaseSubmissionRelations = relations(phaseSubmission, ({one}) => ({
	user_reviewedBy: one(user, {
		fields: [phaseSubmission.reviewedBy],
		references: [user.id],
		relationName: "phaseSubmission_reviewedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [phaseSubmission.userId],
		references: [user.id],
		relationName: "phaseSubmission_userId_user_id"
	}),
	registration: one(registration, {
		fields: [phaseSubmission.registrationId],
		references: [registration.id]
	}),
	event: one(event, {
		fields: [phaseSubmission.eventId],
		references: [event.id]
	}),
	eventPhase: one(eventPhase, {
		fields: [phaseSubmission.phaseId],
		references: [eventPhase.id]
	}),
	phaseForm: one(phaseForm, {
		fields: [phaseSubmission.phaseFormId],
		references: [phaseForm.id]
	}),
}));

export const hackathonRelations = relations(hackathon, ({one}) => ({
	user: one(user, {
		fields: [hackathon.userId],
		references: [user.id]
	}),
}));