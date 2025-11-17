// api.js (ESM)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

import classRouter from "./routes/classRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import mentorRouter from "./routes/mentorRoutes.js";
import opportunityRouter from "./routes/opportunityRoutes.js";
import resourceRouter from "./routes/resourceRoutes.js";
import grantRouter from "./routes/grantRoutes.js";
import feedbackRouter from "./routes/feedRoutes.js";
import progressRouter from "./routes/progressRoutes.js";
import aiTeacherRoutes from "./routes/aiTeacherRoutes.js";

// ----- dotenv (for local dev) -----
dotenv.config();

// ----- Express app -----
const app = express();
app.use(cors());
app.use(express.json());

// ----- MongoDB setup -----
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing in environment variables");
  // For serverless, we don't exit; just respond with error when called
}

const client = new MongoClient(uri, { ignoreUndefined: true });
let students;
let dbInitPromise = null;

async function initDb() {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        await client.connect();
        const db = client.db();
        app.locals.db = db;
        students = db.collection("students");

        await students.createIndex({ email: 1 }, { unique: true });
        await students.createIndex({ phone: 1 }, { unique: true });
        console.log("MongoDB (MongoClient) Connected...");

        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log("Mongoose Connected...");
      } catch (error) {
        console.error("Database init error:", error);
        throw error;
      }
    })();
  }
  return dbInitPromise;
}

function bad(res, code, msg) {
  return res.status(code).json({ error: msg });
}

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isPhone(v = "") {
  return /^[6-9]\d{9}$/.test(v);
}

// ----- Health check -----
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ----- Registration -----
app.post("/api/auth/register", async (req, res) => {
  try {
    if (!students) {
      return bad(res, 500, "Database not initialized");
    }

    const { name, email, phone, grade, board, city, password } = req.body || {};

    if (!name || name.length < 3 || name.length > 60)
      return bad(res, 400, "Full name must be 3–60 characters.");
    if (!email || !isEmail(email))
      return bad(res, 400, "Enter a valid email.");
    if (!phone || !isPhone(phone))
      return bad(res, 400, "Enter a valid 10-digit mobile number.");
    if (!grade) return bad(res, 400, "Select a grade.");
    if (!board) return bad(res, 400, "Select a board.");
    if (!city) return bad(res, 400, "City is required.");
    if (!password || password.length < 8)
      return bad(res, 400, "Password must be at least 8 characters.");

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /\d/.test(password);
    if (!(hasUpper && hasLower && hasNum)) {
      return bad(res, 400, "Password must include uppercase, lowercase, and a number.");
    }

    const existing = await students.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return bad(res, 409, "Email already registered.");
      }
      if (existing.phone === phone) {
        return bad(res, 409, "Phone already registered.");
      }
    }

    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const doc = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      grade,
      board,
      city: city.trim(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await students.insertOne(doc);
    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || "field";
      return bad(res, 409, `${key} already registered.`);
    }
    console.error("Register error:", err);
    return bad(res, 500, "Server error. Please try again.");
  }
});

// Root
app.get("/", (req, res) => res.send("API is Live!"));

// ----- Routes -----
app.use("/api/classes", classRouter);
app.use("/api/courses", courseRouter);
app.use("/api/dashboards", dashboardRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/mentors", mentorRouter);
app.use("/api/opportunities", opportunityRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/grants", grantRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api/progress", progressRouter);
app.use("/api/ai-teacher", aiTeacherRoutes);

// ----- Login -----
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!students) {
      return res.status(500).json({ message: "Database not initialized." });
    }

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const student = await students.findOne({ email: (email || "").toLowerCase() });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, student.passwordHash || "");
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign(
      { sid: String(student._id), name: student.name, email: student.email, role: "student" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      student: {
        id: String(student._id),
        name: student.name,
        email: student.email,
        grade: student.grade,
        board: student.board,
        city: student.city,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ----- Vercel handler (IMPORTANT) -----
export default async function handler(req, res) {
  try {
    await initDb();
    return app(req, res);
  } catch (e) {
    console.error("Handler-level DB error:", e);
    return res.status(500).json({ error: "Database connection failed" });
  }
}
