import express, { type Request, type Response } from "express";
import { ENV } from "./config/env.config.js";
import { pool } from "./config/db.config.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onUserForgotPassword } from "./inngest/functions/on-forgot-password.js";
import { serve } from "inngest/express";
import ticketRoutes from "./routes/ticket.routes.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();
app.set("trust proxy", 1);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

if (ENV.APP_URL) {
  allowedOrigins.add(ENV.APP_URL);
}

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onUserForgotPassword ,onTicketCreated],
  })
);
app.use("/api/auth", userRoutes
);

app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req: Request, res: Response) => res.send("Hello World!"));

const port = ENV.PORT || 3000;

pool
  .connect()
  .then((client) => {
    client.release();
    console.log("✅ Connected to DB");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
