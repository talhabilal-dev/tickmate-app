import zod from "zod";

export const createTicketSchema = zod
  .object({
    title: zod.string().trim().min(1, "Title is required").max(255, "Title is too long"),
    description: zod.string().trim().min(1, "Description is required"),
    category: zod.string().trim().min(1, "Category is required").max(255, "Category is too long"),
    priority: zod.enum(["low", "medium", "high"]).optional(),
    deadline: zod.coerce.date().optional(),
    relatedSkills: zod.array(zod.string().trim().min(1)).optional(),
    helpfulNotes: zod.string().trim().optional(),
    isPublic: zod.boolean().optional(),
  })
  .strip();

export const ticketReplySchema = zod
  .object({
    ticketId: zod.coerce.number().int().positive("Valid ticket id is required"),
    message: zod.string().trim().min(1, "Message is required"),
  })
  .strip();

export const deleteTicketSchema = zod
  .object({
    ticketId: zod.coerce.number().int().positive("Valid ticket id is required"),
  })
  .strip();

export const editTicketSchema = zod
  .object({
    ticketId: zod.coerce.number().int().positive("Valid ticket id is required"),
    title: zod.string().trim().min(1).max(255).optional(),
    description: zod.string().trim().min(1).optional(),
    category: zod.string().trim().min(1).max(255).optional(),
    deadline: zod.coerce.date().optional().nullable(),
    status: zod.enum(["pending", "in_progress", "completed"]).optional(),
    priority: zod.enum(["low", "medium", "high"]).optional(),
    assignedTo: zod.coerce.number().int().positive().optional().nullable(),
    helpfulNotes: zod.string().trim().optional().nullable(),
    relatedSkills: zod.array(zod.string().trim().min(1)).optional(),
    isPublic: zod.boolean().optional(),
  })
  .strip();
