import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth from "./auth.js";
import spin from "./spin.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/spin", spin);
app.get("/", (req,res)=>res.send("Backend running"));
app.listen(process.env.PORT || 3000);
