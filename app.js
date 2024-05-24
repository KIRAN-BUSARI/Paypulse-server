import express from "express";
import morgan from "morgan"
import userRoutes from "./routes/user.routes.js";
import accountRoutes from "./routes/account.routes.js";
import cors from "cors";

import { config } from "dotenv";
config({
    path: ".env"
})

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use('/api/v1/accounts', accountRoutes);

export default app;