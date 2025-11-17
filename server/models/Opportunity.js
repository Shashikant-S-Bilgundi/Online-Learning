import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  kind: { type: String, required: true, enum: ["Employment", "Internship", "Development"] },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  mode: { type: String, required: true, enum: ["On-site", "Remote", "Hybrid"] },
  salary: { type: String },   // For Employment
  stipend: { type: String },  // For Internship
  fee: { type: String },      // For Development
  posted: { type: String, required: true },
  rating: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  desc: { type: String },
  link: { type: String },
  logo: { type: String }
}, { timestamps: true });

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;