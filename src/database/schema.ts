import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["student", "manager"]);

export const users = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	role: userRole().notNull().default("student"),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable("courses", {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull().unique(),
	description: text(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const enrollments = pgTable(
	"enrollments",
	{
		id: uuid().primaryKey().defaultRandom(),
		userID: uuid()
			.notNull()
			.references(() => users.id),
		courseID: uuid()
			.notNull()
			.references(() => courses.id),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [uniqueIndex().on(table.courseID, table.userID)]
);
