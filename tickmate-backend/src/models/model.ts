import { sql } from "drizzle-orm";
import {
    boolean,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    integer,
    varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "moderator", "admin"]);
export const ticketStatusEnum = pgEnum("ticket_status", [
    "pending",
    "in_progress",
    "completed",
]);
export const ticketPriorityEnum = pgEnum("ticket_priority", [
    "low",
    "medium",
    "high",
]);
export const magicLinkPurposeEnum = pgEnum("magic_link_purpose", [
    "email_verification",
    "password_reset",
    "password_change",
]);

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    loginTime: timestamp("login_time", { withTimezone: true })
        .defaultNow()
        .notNull(),
    password: text("password").notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    skills: text("skills").array().default(sql`'{}'`).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    isActive: boolean("is_active").default(false).notNull(),
});

type TicketReply = {
    message: string | null;
    createdAt: string | null;
    createdBy: string | null;
};

export const ticketsTable = pgTable("tickets", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("status").default("pending").notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    priority: ticketPriorityEnum("priority").default("medium").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }),
    helpfulNotes: text("helpful_notes"),
    isPublic: boolean("is_public").default(true).notNull(),
    relatedSkills: text("related_skills").array().default(sql`'{}'`).notNull(),
    replies: jsonb("replies").$type<TicketReply[]>().default(sql`'[]'::jsonb`).notNull(),
    createdBy: integer("created_by").references(() => usersTable.id),
    assignedTo: integer("assigned_to").references(() => usersTable.id),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const magicLinksTable = pgTable("magic_links", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id)
        .notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    purpose: magicLinkPurposeEnum("purpose").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
