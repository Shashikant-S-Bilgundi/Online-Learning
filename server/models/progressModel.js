import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  progress: { type: Number, min: 0, max: 100 },
  accuracy: { type: Number, min: 0, max: 100 },
  trend: [{ type: Number }],
});

const heatmapSchema = new mongoose.Schema({
  weekData: [[{ type: Number }]], // 6 weeks x 7 days
});

const activitySchema = new mongoose.Schema({
  when: { type: String, required: true },
  icon: { type: String, required: true },
  text: { type: String, required: true },
});

const badgeSchema = new mongoose.Schema({
  name: String,
  desc: String,
  color: String,
  icon: String, // store icon name, not JSX
});

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    KPIS: {
      studyMinutes: Number,
      accuracy: Number,
      streak: Number,
      rank: Number,
      totalMinutes: Number,
      completion: Number,
    },
    subjects: [subjectSchema],
    heatmap: heatmapSchema,
    activity: [activitySchema],
    badges: [badgeSchema],
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;