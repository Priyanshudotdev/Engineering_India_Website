CREATE TABLE `hackathon_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`college` text NOT NULL,
	`branch` text NOT NULL,
	`year` text NOT NULL,
	`overall_rating` integer NOT NULL,
	`experience_rating` integer NOT NULL,
	`organization_rating` integer NOT NULL,
	`what_you_liked` text,
	`improvements` text,
	`suggestions` text,
	`would_recommend` integer NOT NULL,
	`venue_rating` integer,
	`food_rating` integer,
	`mentorship_rating` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
DROP INDEX `event_form_event_id_unique`;--> statement-breakpoint
ALTER TABLE `event` ADD `registration_fee` text;--> statement-breakpoint
ALTER TABLE `event` ADD `google_form_link` text;--> statement-breakpoint
ALTER TABLE `hackathon` ADD `round2_qualified` integer DEFAULT false NOT NULL;