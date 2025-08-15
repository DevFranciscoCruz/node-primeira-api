CREATE TABLE "enrollments" (
	"userID" uuid NOT NULL,
	"courseID" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userID_users_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseID_courses_id_fk" FOREIGN KEY ("courseID") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;