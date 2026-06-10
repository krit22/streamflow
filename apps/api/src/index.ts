import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import channelRoutes from "./routes/channel.routes";
import videoRoutes from "./routes/video.routes";

const app = express();

app.set("trust proxy", 1);

const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: webOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/channels", channelRoutes);
app.use("/api/v1/videos", videoRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
