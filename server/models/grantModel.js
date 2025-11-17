import mongoose from "mongoose";

const grantSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ["Scholarship", "Loan", "Incentive"],
    },
    source: {
      type: String,
      required: true,
      enum: ["Government", "NGO"],
    },
    title: { type: String, required: true },
    authority: { type: String, required: true },
    state: { type: String, required: true },
    amount: { type: String, required: true },
    deadline: { type: String, default: "Rolling" },
    eligibility: [{ type: String }],
    desc: { type: String },
    link: { type: String },
    tags: [{ type: String }],
    thumbnail: { type: String }, // optional
    previewUrl: { type: String }, // optional
    downloadUrl: { type: String }, // optional
  },
  { timestamps: true }
);

const Grant = mongoose.model("Grants", grantSchema);

export default Grant;