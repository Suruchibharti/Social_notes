import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.ts";
import postRoutes from "./routes/post.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import { errorHandler, notFound } from "./middleware/error.middleware.ts";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Social Notes API is running" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
