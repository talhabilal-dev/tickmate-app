import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { ENV } from "../config/env.config.js";

export type MagicLinkPurpose =
    | "email_verification"
    | "password_reset"
    | "password_change";

type GenerateMagicLinkInput = {
    userId: string;
    purpose: MagicLinkPurpose;
    baseUrl?: string;
    expiresInMinutes?: number;
};

type GenerateMagicLinkResult = {
    rawToken: string;
    tokenHash: string;
    link: string;
    expiresAt: Date;
};

const MAGIC_LINK_PATH = "/auth/magic-link";

export const generateMagicLink = async ({
    userId,
    purpose,
    baseUrl = ENV.APP_URL,
    expiresInMinutes = 30,
}: GenerateMagicLinkInput): Promise<GenerateMagicLinkResult> => {
    if (!baseUrl) {
        throw new Error("APP_URL is not set. Pass baseUrl or set APP_URL in env.");
    }

    if (!userId) {
        throw new Error("userId is required to generate a magic link.");
    }

    if (expiresInMinutes <= 0) {
        throw new Error("expiresInMinutes must be greater than 0.");
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = await argon2.hash(rawToken);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const linkUrl = new URL(MAGIC_LINK_PATH, baseUrl);
    linkUrl.searchParams.set("token", rawToken);
    linkUrl.searchParams.set("userId", userId);
    linkUrl.searchParams.set("purpose", purpose);

    return {
        rawToken,
        tokenHash,
        link: linkUrl.toString(),
        expiresAt,
    };
};
