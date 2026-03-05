import argon2 from "argon2";
import db from "../config/db.config.js";
import {
  signupSchema,
  verifySchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  usernameAvailabilitySchema,
} from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";
import { inngest } from "../inngest/client.js";
import type { Request, Response } from "express";
import { usersTable, magicLinksTable } from "../models/model.js";
import { and, eq, or } from "drizzle-orm";


export const signup = async (req: Request, res: Response) => {

  const { name, email, password, username, skills = [] } = req.body;

  const validation = signupSchema.safeParse({ name, email, password, username, skills });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }
  try {

    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.username, username)));

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const [newUser] = await db.insert(usersTable).values({
      name,
      username,
      email,
      password: hashedPassword,
      skills,
    }).returning({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      email: usersTable.email,
      skills: usersTable.skills
    })

    await inngest.send({
      name: "user/signup",
      data: { userId: newUser?.id, email: newUser?.email },
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully", user: newUser });
  } catch (error) {

    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });


  }
};

export const verify = async (req: Request, res: Response) => {

  const { token } = req.body;
  const validation = verifySchema.safeParse({ token });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {

    if (!ENV.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as {
      userId?: string | number;
      email?: string;
      purpose?: string;
    };

    const userId = Number(payload.userId);
    const purpose = payload.purpose;

    if (!userId || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const [verificationRecords] = await db
      .select()
      .from(magicLinksTable)
      .where(
        and(
          eq(magicLinksTable.userId, userId),
          eq(magicLinksTable.purpose, purpose as "email_verification" | "password_reset" | "password_change")
        )
      );

    if (!verificationRecords) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already used token",
      });
    }


    if (verificationRecords?.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    await db.update(usersTable).set({ isActive: true }).where(eq(usersTable.id, userId));
    await db.delete(magicLinksTable).where(eq(magicLinksTable.id, verificationRecords.id));

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

}

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;


  const validation = loginSchema.safeParse({ identifier, password });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, identifier),
          eq(usersTable.username, identifier)
        )
      );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "User is not active",
        success: false,
      });
    }

    // Standard user token
    const token = jwt.sign(
      {
        userId: user.id.toString(),
        role: user.role,
        isActive: user.isActive,
      } as {
        userId: string;
        role: string;
        isActive: boolean;
      },
      ENV.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    let adminToken = null;
    if (user.role === "admin") {
      adminToken = jwt.sign(
        {
          adminId: user.id.toString(),
          role: "admin",
          scope: "full-access",
        } as {
          adminId: string;
          role: string;
          scope: string;
        },
        ENV.JWT_SECRET!,
        { expiresIn: "12h" }
      );
    }

    await db.update(usersTable).set({ loginTime: new Date() }).where(eq(usersTable.id, user.id));

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ENV.COOKIE_DOMAIN,
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (adminToken) {
      res.cookie("adminToken", adminToken, {
        httpOnly: true,
        secure: true,
        domain: ENV.COOKIE_DOMAIN,
        sameSite: "none",
        maxAge: 12 * 60 * 60 * 1000,
      });
    }

    return res.status(200).json({
      user,
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {

    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }

    // Clear both tokens
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      domain: ENV.NODE_ENV === "development" ? undefined : ENV.COOKIE_DOMAIN,
      sameSite: "none",
    });
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      domain: ENV.NODE_ENV === "development" ? undefined : ENV.COOKIE_DOMAIN,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {

    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized Access ", success: false });
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(req.user.userId)));
    if (!user) {
      return res
        .status(404)
        .json({ message: "Failed to get user", success: false });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, username, email, skills } = req.body;

  const validation = updateUserSchema.safeParse({ name, username, email, skills });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized Access", success: false });
    }

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(req.user.userId)));

    if (!existingUser) {
      return res.status(404).json({ message: "Failed to get user", success: false });
    }

    const updateData: Partial<{
      name: string;
      username: string;
      email: string;
      skills: string[];
      isActive: boolean;
    }> = {};

    if (typeof name !== "undefined") {
      updateData.name = name;
    }

    if (typeof skills !== "undefined") {
      updateData.skills = skills;
    }

    if (typeof username !== "undefined" && username !== existingUser.username) {
      const [usernameInUse] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.username, username));

      if (usernameInUse && usernameInUse.id !== existingUser.id) {
        return res.status(409).json({
          success: false,
          message: "Username is already in use",
        });
      }

      updateData.username = username;
    }

    let emailChanged = false;
    if (typeof email !== "undefined" && email !== existingUser.email) {
      const [emailInUse] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (emailInUse && emailInUse.id !== existingUser.id) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }

      updateData.email = email;
      updateData.isActive = false;
      emailChanged = true;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes were provided",
        user: existingUser,
      });
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, existingUser.id))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
        skills: usersTable.skills,
        isActive: usersTable.isActive,
      });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }

    if (emailChanged) {
      await inngest.send({
        name: "user/signup",
        data: { userId: updatedUser.id, email: updatedUser.email },
      });
    }

    return res.status(200).json({
      success: true,
      message: emailChanged
        ? "Profile updated. Please verify your new email address."
        : "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(req.user.userId)));

    if (!user) {
      return res
        .status(404)
        .json({ message: "Failed to get user", success: false });
    }

    const passwordMatch = await argon2.verify(user.password, oldPassword);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid old password", success: false });
    }

    const hashedPassword = await argon2.hash(newPassword);
    await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, Number(req.user.userId)));

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const validation = forgotPasswordSchema.safeParse({ email });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (user) {
      await inngest.send({
        name: "user/forgot-password",
        data: { userId: user.id, email: user.email },
      });
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const validation = resetPasswordSchema.safeParse({ token, newPassword });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {
    if (!ENV.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as {
      userId?: string | number;
      purpose?: string;
    };

    const userId = Number(payload.userId);
    const purpose = payload.purpose;

    if (!userId || purpose !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const [resetRecord] = await db
      .select()
      .from(magicLinksTable)
      .where(
        and(
          eq(magicLinksTable.userId, userId),
          eq(magicLinksTable.purpose, "password_reset"),
          eq(magicLinksTable.tokenHash, token)
        )
      );

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already used token",
      });
    }

    if (resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, userId));
    await db.delete(magicLinksTable).where(eq(magicLinksTable.id, resetRecord.id));

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const checkUsernameAvailability = async (req: Request, res: Response) => {
  const username = String(req.query.username ?? "");
  const validation = usernameAvailabilitySchema.safeParse({ username });

  if (!validation.success) {
    const errors = validation.error?.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ errors, success: false });
  }

  try {
    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username));

    return res.status(200).json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Username is already taken" : "Username is available",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Internal Server Error", error.message)
    } else {
      console.log("Internal Server Error", error)
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
