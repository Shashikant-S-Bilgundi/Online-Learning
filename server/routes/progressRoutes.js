// server/routes/progressRoutes.js
import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();

// Expect your main api.js to export the connected MongoClient or DB.
// If not, re-import your uri and connect here similarly.
// Here, we assume you can get a handle like `req.app.locals.db`.
function getDb(req) {
  // If you set in api.js: app.locals.db = client.db();
  return req.app.locals.db;
}

// Save a quiz result
router.post("/:userId/quiz", async (req, res) => {
  try {
    const db = getDb(req);
    const { userId } = req.params;
    const { quizId, quizTitle, subject, total, correct, accuracy, takenAt } = req.body || {};

    if (!userId || !quizId || typeof total !== "number" || typeof correct !== "number") {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const col = db.collection("progress");
    const resultItem = {
      type: "quiz",
      quizId,
      quizTitle: quizTitle || "Quiz",
      subject: subject || "General",
      total,
      correct,
      accuracy: Number(accuracy) || Math.round((correct / Math.max(1,total)) * 100),
      takenAt: takenAt ? new Date(takenAt) : new Date()
    };

    // Upsert progress doc per user
    await col.updateOne(
      { userId },
      {
        $push: { results: resultItem, activity: {
          id: `q_${quizId}_${Date.now()}`,
          icon: "quiz",
          text: `Quiz "${resultItem.quizTitle}" scored ${correct}/${total} (${resultItem.accuracy}%)`,
          when: new Date().toISOString()
        }},
        $setOnInsert: { userId, createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("Save quiz progress error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// Enroll into a course
router.post("/:userId/course-enroll", async (req, res) => {
  try {
    const db = getDb(req);
    const { userId } = req.params;
    const { courseId, title, category, level, thumbnail } = req.body || {};

    if (!userId || !courseId || !title) {
      return res.status(400).json({ error: "courseId and title are required." });
    }

    const col = db.collection("progress");

    // Store basic enrollment info; prevent duplicates by courseId
    await col.updateOne(
      { userId },
      {
        $addToSet: {
          enrolledCourses: {
            courseId: String(courseId),
            title,
            category: category || "General",
            level: level || "All",
            thumbnail: thumbnail || "",
            enrolledAt: new Date(),
          }
        },
        $push: {
          activity: {
            id: `enroll_${courseId}_${Date.now()}`,
            icon: "video", // or custom "course"
            text: `Enrolled into course "${title}"`,
            when: new Date().toISOString()
          }
        },
        $setOnInsert: { userId, createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("Enroll course error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

 
// Join a class (stores it under joinedClasses + adds activity)
router.post("/:userId/class-join", async (req, res) => {
  try {
    const db = getDb(req);
    const { userId } = req.params;
    const {
      classId, title, subject, track, date, start, end,
      mode, room, thumbnail
    } = req.body || {};

    if (!userId || !classId || !title) {
      return res.status(400).json({ error: "classId and title are required." });
    }

    const col = db.collection("progress");

    // Only add if not already present
    await col.updateOne(
      { userId, "joinedClasses.classId": { $ne: String(classId) } },
      {
        $push: {
          joinedClasses: {
            classId: String(classId),
            title,
            subject: subject || "General",
            track: track || "K-12",
            date: date || "",
            start: start || "",
            end: end || "",
            mode: mode || "Live",
            room: room || "",
            thumbnail: thumbnail || "",
            joinedAt: new Date(),
          }
        },
        $push: {
          activity: {
            id: `join_${classId}_${Date.now()}`,
            icon: "class",
            text: `Joined class "${title}"`,
            when: new Date().toISOString()
          }
        },
        $setOnInsert: { userId, createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("Join class error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});


// Book a mentor session (stores under mentorSessions + adds activity)
router.post("/:userId/mentor-book", async (req, res) => {
  try {
    const db = getDb(req);
    const { userId } = req.params;
    const {
      mentorId, mentorName, subjects, languages, city, price,
      date, time, duration, mode = "Live 1:1", photo
    } = req.body || {};

    if (!userId || !mentorId || !mentorName || !date || !time) {
      return res.status(400).json({ error: "mentorId, mentorName, date, time are required." });
    }

    const col = db.collection("progress");

    // Only add exact same booking once (same mentorId + date + time)
    await col.updateOne(
      {
        userId,
        "mentorSessions": {
          $not: {
            $elemMatch: { mentorId: String(mentorId), date, time }
          }
        }
      },
      {
        $push: {
          mentorSessions: {
            mentorId: String(mentorId),
            mentorName,
            subjects: Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []),
            languages: Array.isArray(languages) ? languages : (languages ? [languages] : []),
            city: city || "",
            price: Number(price) || 0,
            date,
            time,
            duration: Number(duration) || 45,
            mode,
            photo: photo || "",
            bookedAt: new Date()
          }
        },
        $push: {
          activity: {
            id: `mentor_${mentorId}_${Date.now()}`,
            icon: "class",
            text: `Booked mentor session with "${mentorName}" on ${date} at ${time}`,
            when: new Date().toISOString()
          }
        },
        $setOnInsert: { userId, createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("Mentor book -> progress error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});


// Read aggregates for MyProgress
router.get("/:userId", async (req, res) => {
  try {
    const db = getDb(req);
    const { userId } = req.params;
    const doc = await db.collection("progress").findOne({ userId });

    const results = doc?.results || [];
    const activity = (doc?.activity || []).slice(-20).reverse(); // last 20
    const enrolledCourses = Array.isArray(doc?.enrolledCourses) ? doc.enrolledCourses : [];
    const joinedClasses   = Array.isArray(doc?.joinedClasses)   ? doc.joinedClasses   : [];
    const mentorSessions  = Array.isArray(doc?.mentorSessions)  ? doc.mentorSessions  : [];

    // Simple aggregates
    const quizzes = results.filter(r => r.type === "quiz");
    const totalQuizzes = quizzes.length;
    const avgAccuracy = totalQuizzes
      ? Math.round(quizzes.reduce((a, r) => a + (r.accuracy || 0), 0) / totalQuizzes)
      : 0;

    // Subject progress (toy logic: average accuracy per subject)
    const bySubject = {};
    quizzes.forEach(r => {
      const s = r.subject || "General";
      if (!bySubject[s]) bySubject[s] = { count: 0, accSum: 0 };
      bySubject[s].count += 1;
      bySubject[s].accSum += r.accuracy || 0;
    });
    const subjects = Object.keys(bySubject).map(name => {
      const avg = Math.round(bySubject[name].accSum / bySubject[name].count);
      return {
        name,
        accuracy: avg,
        progress: Math.min(100, avg), // map to bar for now
        trend: [] // you can compute a trend array later
      };
    });

    // Heatmap: build a 6x7 matrix (last 6 weeks, Mon-Sun) with simple counts
    const heatmap = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0));
    quizzes.forEach(r => {
      const d = new Date(r.takenAt || Date.now());
      const weeksAgo = Math.floor((Date.now() - d.getTime()) / (7*24*3600*1000));
      if (weeksAgo >= 0 && weeksAgo < 6) {
        const day = d.getDay(); // 0 Sun..6 Sat
        const idx = (day + 6) % 7; // make Mon=0..Sun=6
        heatmap[5 - weeksAgo][idx] += 1; // recent week on the right
      }
    });

    const kpis = {
      studyMinutes: 0,        // fill from classes/videos if you track
      totalMinutes: 0,        // fill from watch time if you track
      completion: avgAccuracy, // quick proxy: average accuracy
      accuracy: avgAccuracy,
      streak: 0,              // compute based on daily activity if required
      rank: 0                 // optional: compute against leaderboard
    };

    const badges = []; // derive based on milestones

    return res.json({ 
      data: {
        kpis,
        subjects,
        heatmap,
        activity,
        badges,
        enrolledCourses,
        joinedClasses,
        mentorSessions
      }
    });
  } catch (e) {
    console.error("Read progress error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
