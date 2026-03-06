import db from "../config/db.config.js";
import { desc, eq, ne } from "drizzle-orm";
import { usersTable, ticketsTable } from "../models/model.js";
import { sendError, sendSuccess, sendZodValidationError } from "../utils/response.utils.js";
import type { Request, Response } from "express";
import { usersListResponseSchema } from "../schemas/user-response.schema.js";
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  loginSchema,
} from "../schemas/user.schema.js";
import { adminCreateTicketSchema } from "../schemas/ticket.schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";


export const adminLogin = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  const validation = loginSchema.safeParse({ identifier, password });

  if (!validation.success) {
    return sendZodValidationError(res, validation.error.issues);
  }

  try {
    const [admin] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, identifier));

    if (!admin || admin.role !== "admin") {
      return sendError(res, 401, {
        message: "Invalid admin credentials",
      });
    }

    const isPasswordValid = await argon2.verify(admin.password, password);

    if (!isPasswordValid) {
      return sendError(res, 401, {
        message: "Invalid admin credentials",
      });
    }

    if (!admin.isActive) {
      return sendError(res, 401, {
        message: "Admin is not active",
      });
    }

    if (!ENV.JWT_SECRET) {
      return sendError(res, 500, {
        message: "JWT_SECRET is not configured",
      });
    }

    const token = jwt.sign(
      {
        userId: admin.id.toString(),
        role: admin.role,
        isActive: admin.isActive,
      },
      ENV.JWT_SECRET,
      { expiresIn: "12h" }
    );

    await db
      .update(usersTable)
      .set({ loginTime: new Date() })
      .where(eq(usersTable.id, admin.id));

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ENV.COOKIE_DOMAIN,
      maxAge: 12 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 200, {
      message: "Admin logged in successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in admin login:", error.message);
    } else {
      console.error("Error in admin login:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const adminLogout = async (req: Request, res: Response) => {

  try {

    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      domain: ENV.NODE_ENV === "development" ? undefined : ENV.COOKIE_DOMAIN,
      sameSite: "none",
    });

    return sendSuccess(res, 200, {
      message: "Admin logged out successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in admin logout:", error.message);
    } else {
      console.error("Error in admin logout:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        skills: usersTable.skills,
        isActive: usersTable.isActive,
        loginTime: usersTable.loginTime,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(ne(usersTable.role, "admin"))
      .orderBy(desc(usersTable.createdAt));

    const validation = usersListResponseSchema.safeParse({
      message: "Users fetched successfully",
      users,
    });

    if (!validation.success) {
      return sendZodValidationError(res, validation.error.issues);
    }

    return sendSuccess(res, 200, {
      message: validation.data.message,
      users: validation.data.users,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
    } else {
      console.error("Error fetching users:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const createUserByAdmin = async (req: Request, res: Response) => {
  const { name, username, email, password, skills = [], role = "user" } = req.body;

  const validation = adminCreateUserSchema.safeParse({
    name,
    username,
    email,
    password,
    skills,
    role,
  });

  if (!validation.success) {
    return sendZodValidationError(res, validation.error.issues);
  }

  try {
    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    const [existingUser] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return sendError(res, 409, {
        message: "Email already exists",
      });
    }

    const [existingUsername] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (existingUsername) {
      return sendError(res, 409, {
        message: "Username already exists",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        username,
        email,
        password: hashedPassword,
        skills,
        role,
        isActive: true,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        skills: usersTable.skills,
        isActive: usersTable.isActive,
        loginTime: usersTable.loginTime,
        createdAt: usersTable.createdAt,
      });

    return sendSuccess(res, 201, {
      message: "User created by admin successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user by admin:", error.message);
    } else {
      console.error("Error creating user by admin:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    const tickets = await db
      .select()
      .from(ticketsTable)
      .orderBy(desc(ticketsTable.createdAt));

    return sendSuccess(res, 200, {
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching tickets:", error.message);
    } else {
      console.error("Error fetching tickets:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const createTicketByAdmin = async (req: Request, res: Response) => {
  const validation = adminCreateTicketSchema.safeParse(req.body);

  if (!validation.success) {
    return sendZodValidationError(res, validation.error.issues);
  }

  const {
    title,
    description,
    category,
    assignedTo,
    helpfulNotes,
    priority,
    deadline,
    relatedSkills,
    isPublic,
  } = validation.data;

  try {
    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    const [moderator] = await db
      .select({
        id: usersTable.id,
        role: usersTable.role,
        isActive: usersTable.isActive,
      })
      .from(usersTable)
      .where(eq(usersTable.id, assignedTo));

    if (!moderator) {
      return sendError(res, 404, {
        message: "Assigned user not found",
      });
    }

    if (moderator.role !== "moderator") {
      return sendError(res, 400, {
        message: "Ticket can only be assigned to a moderator",
      });
    }

    if (!moderator.isActive) {
      return sendError(res, 400, {
        message: "Assigned moderator is not active",
      });
    }

    const [newTicket] = await db
      .insert(ticketsTable)
      .values({
        title,
        description,
        category,
        createdBy: Number(req.user.userId),
        assignedTo,
        helpfulNotes,
        priority,
        deadline,
        relatedSkills,
        isPublic,
      })
      .returning();

    if (!newTicket) {
      return sendError(res, 500, {
        message: "Failed to create ticket",
      });
    }

    return sendSuccess(res, 201, {
      message: "Ticket created and assigned to moderator successfully",
      ticket: newTicket,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating ticket by admin:", error.message);
    } else {
      console.error("Error creating ticket by admin:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return sendError(res, 403, {
        message: "Forbidden: Admins only",
      });
    }

    const { userId } = req.body;
    const parsedUserId = Number(userId);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return sendError(res, 400, {
        message: "Valid userId is required",
      });
    }

    const [deletedUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, parsedUserId))
      .returning({ id: usersTable.id });

    if (!deletedUser) {
      return sendError(res, 404, {
        message: "User not found",
      });
    }

    return sendSuccess(res, 200, {
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error.message);
    } else {
      console.error("Error deleting user:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const admin = req.user;
    if (!admin || admin.role !== "admin") {
      return sendError(res, 403, { message: "Access denied" });
    }

    const [adminProfile] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        skills: usersTable.skills,
        isActive: usersTable.isActive,
        loginTime: usersTable.loginTime,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, Number(admin.userId)));

    if (!adminProfile) {
      return sendError(res, 404, { message: "Admin profile not found" });
    }

    if (!adminProfile.isActive) {
      return sendError(res, 403, { message: "Admin is not active" });
    }

    const [users, tickets] = await Promise.all([
      db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          email: usersTable.email,
          role: usersTable.role,
          skills: usersTable.skills,
          isActive: usersTable.isActive,
          loginTime: usersTable.loginTime,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .orderBy(desc(usersTable.createdAt)),
      db
        .select()
        .from(ticketsTable)
        .orderBy(desc(ticketsTable.createdAt)),
    ]);

    const inProgressCount = tickets.filter((ticket) => ticket.status === "in_progress").length;
    const completedCount = tickets.filter((ticket) => ticket.status === "completed").length;
    const activeUsersCount = users.filter((user) => user.isActive).length;

    return sendSuccess(res, 200, {
      adminProfile: adminProfile,
      users,
      tickets,
      stats: {
        totalUsers: users.length,
        totalTickets: tickets.length,
        inProgressTickets: inProgressCount,
        completedTickets: completedCount,
        activeUsers: activeUsersCount,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Dashboard Error:", error.message);
    } else {
      console.error("Dashboard Error:", error);
    }
    return sendError(res, 500, { message: "Server error loading dashboard" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const validation = adminUpdateUserSchema.safeParse(req.body);

  if (!validation.success) {
    return sendZodValidationError(res, validation.error.issues);
  }

  const { _id, userId, name, username, email, skills, role, isActive } = validation.data;

  if (!req.user || req.user.role !== "admin") {
    return sendError(res, 403, {
      message: "Forbidden: Admins only",
    });
  }

  try {
    const parsedUserId = Number(_id ?? userId);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return sendError(res, 400, {
        message: "Valid userId is required",
      });
    }

    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, parsedUserId));

    if (!existingUser) {
      return sendError(res, 404, {
        message: "User not found",
      });
    }

    if (typeof email !== "undefined") {
      const [emailOwner] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (emailOwner && emailOwner.id !== parsedUserId) {
        return sendError(res, 409, {
          message: "Email is already in use",
        });
      }
    }

    if (typeof username !== "undefined") {
      const [usernameOwner] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.username, username));

      if (usernameOwner && usernameOwner.id !== parsedUserId) {
        return sendError(res, 409, {
          message: "Username is already in use",
        });
      }
    }

    const updateData: Partial<{
      name: string;
      username: string;
      email: string;
      skills: string[];
      role: "user" | "moderator" | "admin";
      isActive: boolean;
    }> = {};

    if (typeof name !== "undefined") updateData.name = name;
    if (typeof username !== "undefined") updateData.username = username;
    if (typeof email !== "undefined") updateData.email = email;
    if (typeof skills !== "undefined") updateData.skills = skills;
    if (typeof role !== "undefined") updateData.role = role;
    if (typeof isActive !== "undefined") updateData.isActive = isActive;

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, parsedUserId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        skills: usersTable.skills,
        isActive: usersTable.isActive,
        loginTime: usersTable.loginTime,
        createdAt: usersTable.createdAt,
      });

    if (!updatedUser) {
      return sendError(res, 404, {
        message: "User not found",
      });
    }

    return sendSuccess(res, 200, {
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("Error updating user:", error);
    }
    return sendError(res, 500, {
      message: "Internal Server Error",
    });
  }
};
