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


const app = express();
app.set("trust proxy", 1);

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
