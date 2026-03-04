import express from "express";
import ENV from "./config/env.config.ts";
import connectDB from "./config/db.config.ts";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import ticketRoutes from "./routes/ticket.routes.ts";
import adminRoutes from "./routes/admin.routes.ts";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { inngest } from "./inngest/client.ts";
import { onUserSignup } from "./inngest/functions/on-signup.ts";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.ts";
import { serve } from "inngest/express";
import helmet from "helmet";

const app = express();
app.set("trust proxy", 1);

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());

const corsOptions = {
  origin: ENV.APP_URL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  })
);

app.get("/", (req, res) => res.send("Hello from tickmate backend!"));

const port = ENV.PORT || 3000;
connectDB()
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
