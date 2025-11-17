import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  format: { type: String, required: true },
  size: { type: String, required: true },
  tags: { type: [String], default: [] },
  thumbnail: { type: String },
  previewUrl: { type: String },
  downloadUrl: { type: String },
}, { timestamps: true });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;