import type { Request, Response } from "express";
import { inngest } from "../inngest/client.js";
import { usersTable, ticketsTable } from "../models/model.js";
import db from "../config/db.config.js";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import {
  sendError,
  sendSuccess,
  sendZodValidationError,
} from "../utils/response.utils.js";
import {
  createTicketSchema,
  deleteTicketSchema,
  editTicketSchema,
  similarTicketSearchSchema,
  ticketReplySchema,
} from "../schemas/ticket.schema.js";
import {
  deleteTicketVector,
  searchSimilarResolvedPublicTickets,
  upsertResolvedPublicTicketVector,
} from "../utils/vector-db.utils.js";

export const getSimilarResolvedTickets = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const validation = similarTicketSearchSchema.safeParse(req.body);

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    const { title, description, category, limit } = validation.data;

    const searchInput: {
      title: string;
      description: string;
      category?: string;
      limit?: number;
    } = {
      title,
      description,
    };

    if (typeof category !== "undefined") {
      searchInput.category = category;
    }

    if (typeof limit !== "undefined") {
      searchInput.limit = limit;
    }

    const similarTickets = await searchSimilarResolvedPublicTickets(searchInput);

    return sendSuccess(res, 200, {
      message: "Similar tickets fetched successfully",
      tickets: similarTickets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching similar tickets", error.message);
    } else {
      console.error("Error fetching similar tickets", error);
    }

    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, Number(req.user.userId)));

    if (!user) {
      return sendError(res, 401, {
        message: "Unauthorized Access",
      });
    }

    const validation = createTicketSchema.safeParse(req.body);

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    const {
      title,
      description,
      category,
      deadline,
      priority,
      relatedSkills,
      helpfulNotes,
      isPublic,
    } = validation.data;

    const [newTicket] = await db
      .insert(ticketsTable)
      .values({
        title,
        description,
        category,
        createdBy: Number(req.user.userId),
        deadline,
        priority,
        relatedSkills,
        helpfulNotes,
        isPublic,
      })
      .returning();

    if (!newTicket) {
      return sendError(res, 500, { message: "Failed to create ticket" });
    }

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket.id.toString(),
        title,
        description,
        createdBy: req.user.userId,
      },
    });

    return sendSuccess(res, 201, {
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating ticket", error.message);
    } else {
      console.error("Error creating ticket", error);
    }
    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const userId = Number(req.user.userId);

    if (Number.isNaN(userId)) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const tickets = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.createdBy, userId))
      .orderBy(desc(ticketsTable.createdAt));

    return sendSuccess(res, 200, {
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching tickets", error.message);
    } else {
      console.error("Error fetching tickets", error);
    }
    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const toggleTicketStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const { id } = req.params;

    const ticketId = Number(id);

    if (!id || Number.isNaN(ticketId)) {
      return sendError(res, 400, {
        message: "Valid ticket id is required",
        errors: [{ field: "id", message: "Valid ticket id is required" }],
      });
    }

    const userId = Number(req.user.userId);

    const [ticket] = await db
      .select({
        id: ticketsTable.id,
        createdBy: ticketsTable.createdBy,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return sendError(res, 404, {
        message: "Ticket not found",
      });
    }

    const canManage = req.user.role === "admin" || ticket.createdBy === userId;

    if (!canManage) {
      return sendError(res, 403, {
        message: "You are not allowed to update this ticket",
      });
    }

    const [updatedTicket] = await db
      .update(ticketsTable)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(ticketsTable.id, ticketId))
      .returning({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      });

    if (!updatedTicket) {
      return sendError(res, 500, {
        message: "Failed to update ticket status",
      });
    }

    try {
      if (updatedTicket.isPublic) {
        await upsertResolvedPublicTicketVector(updatedTicket);
      } else {
        await deleteTicketVector(updatedTicket.id);
      }
    } catch (vectorError) {
      if (vectorError instanceof Error) {
        console.error("Vector sync failed after status update:", vectorError.message);
      } else {
        console.error("Vector sync failed after status update:", vectorError);
      }
    }

    return sendSuccess(res, 200, {
      message: "Ticket status updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating ticket status", error.message);
    } else {
      console.error("Error updating ticket status", error);
    }

    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const assignedTickets = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const userId = Number(req.user.userId);

    if (Number.isNaN(userId)) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const tickets = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.assignedTo, userId))
      .orderBy(desc(ticketsTable.createdAt));

    return sendSuccess(res, 200, {
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching assigned tickets:", error.message);
    } else {
      console.error("Error fetching assigned tickets:", error);
    }

    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const ticketReply = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const validation = ticketReplySchema.safeParse(req.body);

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    const { message, ticketId } = validation.data;

    if (req.user.role !== "moderator" && req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Moderators and Admins only",
      });
    }

    const [ticket] = await db
      .select({
        id: ticketsTable.id,
        status: ticketsTable.status,
        assignedTo: ticketsTable.assignedTo,
        replies: ticketsTable.replies,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return sendError(res, 404, {
        message: "Ticket not found",
      });
    }

    if (ticket.status === "completed") {
      return sendError(res, 400, {
        message: "Ticket is already closed",
      });
    }

    if (!ticket.assignedTo || ticket.assignedTo !== Number(req.user.userId)) {
      return sendError(res, 403, {
        message: "You are not allowed to reply to this ticket",
      });
    }

    const updatedReplies = [...ticket.replies, {
      message,
      createdAt: new Date().toISOString(),
      createdBy: req.user.userId,
    }];

    const [updatedTicket] = await db
      .update(ticketsTable)
      .set({
        replies: updatedReplies,
        updatedAt: new Date(),
      })
      .where(eq(ticketsTable.id, ticketId))
      .returning({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      });

    if (!updatedTicket) {
      return sendError(res, 500, {
        message: "Failed to update ticket reply",
      });
    }

    return sendSuccess(res, 200, {
      message: "Ticket reply updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error replying to ticket:", error.message);
    } else {
      console.error("Error replying to ticket:", error);
    }
    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const getUserTicketSummary = async (req: Request, res: Response) => {
  try {
    const userIdRaw = req.user?.userId;

    if (!userIdRaw) {
      return sendError(res, 401, {
        message: "Unauthorized",
      });
    }

    const userId = Number(userIdRaw);

    if (Number.isNaN(userId)) {
      return sendError(res, 401, {
        message: "Unauthorized",
      });
    }

    const tickets = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        assignedTo: ticketsTable.assignedTo,
        priority: ticketsTable.priority,
        createdAt: ticketsTable.createdAt,
        status: ticketsTable.status,
        relatedSkills: ticketsTable.relatedSkills,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.createdBy, userId))
      .orderBy(desc(ticketsTable.createdAt));

    // 🔹 Compute current summary
    const totalTickets = tickets.length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const completed = tickets.filter((t) => t.status === "completed").length;

    // 🔹 Define time windows (last 7 days vs previous 7 days)
    const now = new Date();
    const startOfCurrent = new Date();
    startOfCurrent.setDate(now.getDate() - 7);

    const startOfPrevious = new Date();
    startOfPrevious.setDate(now.getDate() - 14);
    const endOfPrevious = new Date();
    endOfPrevious.setDate(now.getDate() - 7);

    const previousTickets = await db
      .select({
        status: ticketsTable.status,
      })
      .from(ticketsTable)
      .where(
        and(
          eq(ticketsTable.createdBy, userId),
          gte(ticketsTable.createdAt, startOfPrevious),
          lt(ticketsTable.createdAt, endOfPrevious)
        )
      );

    const previousSummary = {
      totalTickets: previousTickets.length,
      inProgress: previousTickets.filter((t) => t.status === "in_progress")
        .length,
      completed: previousTickets.filter((t) => t.status === "completed").length,
    };

    return sendSuccess(res, 200, {
      message: "User ticket summary fetched successfully",
      summary: {
        totalTickets,
        inProgress,
        completed,
      },
      previousSummary,
      tickets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user ticket summary:", error.message);
    } else {
      console.error("Error fetching user ticket summary:", error);
    }

    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const validation = deleteTicketSchema.safeParse(req.body);

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    const { ticketId } = validation.data;

    const [ticket] = await db
      .select({
        id: ticketsTable.id,
        createdBy: ticketsTable.createdBy,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return sendError(res, 404, {
        message: "Ticket not found",
      });
    }

    const userId = Number(req.user.userId);

    if (
      ticket.createdBy !== userId &&
      req.user.role !== "admin"
    ) {
      return sendError(res, 403, {
        message: "You are not allowed to delete this ticket",
      });
    }

    const [deletedTicket] = await db
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, ticketId))
      .returning({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      });

    if (!deletedTicket) {
      return sendError(res, 500, {
        message: "Failed to delete ticket",
      });
    }

    try {
      await deleteTicketVector(deletedTicket.id);
    } catch (vectorError) {
      if (vectorError instanceof Error) {
        console.error("Vector delete failed after ticket deletion:", vectorError.message);
      } else {
        console.error("Vector delete failed after ticket deletion:", vectorError);
      }
    }

    return sendSuccess(res, 200, {
      message: "Ticket deleted successfully",
      ticket: deletedTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting ticket", error.message);
    } else {
      console.error("Error deleting ticket", error);
    }

    return sendError(res, 500, { message: "Internal Server Error" });
  }
};

export const editTicket = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendError(res, 401, { message: "Unauthorized" });
    }

    const validation = editTicketSchema.safeParse(req.body);

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    const {
      ticketId,
      title,
      description,
      category,
      deadline,
      status,
      priority,
      assignedTo,
      helpfulNotes,
      relatedSkills,
      isPublic,
    } = validation.data;

    const [ticket] = await db
      .select({
        id: ticketsTable.id,
        status: ticketsTable.status,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return sendError(res, 404, {
        message: "Ticket not found",
      });
    }

    const userId = Number(req.user.userId);

    if (
      ticket.createdBy !== userId &&
      req.user.role !== "admin"
    ) {
      return sendError(res, 403, {
        message: "You are not allowed to edit this ticket",
      });
    }

    if (ticket.status === "completed") {
      return sendError(res, 400, {
        message: "Completed tickets cannot be edited",
      });
    }

    if (typeof assignedTo !== "undefined" && assignedTo !== null) {
      const [assignedUser] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.id, assignedTo));

      if (!assignedUser) {
        return sendError(res, 404, {
          message: "Assigned user not found",
        });
      }
    }

    const updateData: Partial<{
      title: string;
      description: string;
      category: string;
      deadline: Date | null;
      status: "pending" | "in_progress" | "completed";
      priority: "low" | "medium" | "high";
      assignedTo: number | null;
      helpfulNotes: string | null;
      relatedSkills: string[];
      isPublic: boolean;
      updatedAt: Date;
    }> = {};

    if (typeof title !== "undefined") updateData.title = title;
    if (typeof description !== "undefined") updateData.description = description;
    if (typeof category !== "undefined") updateData.category = category;
    if (typeof deadline !== "undefined") updateData.deadline = deadline;
    if (typeof status !== "undefined") updateData.status = status;
    if (typeof priority !== "undefined") updateData.priority = priority;
    if (typeof assignedTo !== "undefined") updateData.assignedTo = assignedTo;
    if (typeof helpfulNotes !== "undefined") updateData.helpfulNotes = helpfulNotes;
    if (typeof relatedSkills !== "undefined") updateData.relatedSkills = relatedSkills;
    if (typeof isPublic !== "undefined") updateData.isPublic = isPublic;

    if (Object.keys(updateData).length === 0) {
      return sendSuccess(res, 200, {
        message: "No changes were provided",
      });
    }

    updateData.updatedAt = new Date();

    const [updatedTicket] = await db
      .update(ticketsTable)
      .set(updateData)
      .where(eq(ticketsTable.id, ticketId))
      .returning({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        status: ticketsTable.status,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        deadline: ticketsTable.deadline,
        helpfulNotes: ticketsTable.helpfulNotes,
        relatedSkills: ticketsTable.relatedSkills,
        replies: ticketsTable.replies,
        isPublic: ticketsTable.isPublic,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
      });

    if (!updatedTicket) {
      return sendError(res, 500, {
        message: "Failed to update ticket",
      });
    }

    return sendSuccess(res, 200, {
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error editing ticket", error.message);
    } else {
      console.error("Error editing ticket", error);
    }

    return sendError(res, 500, { message: "Internal Server Error" });
  }
};
