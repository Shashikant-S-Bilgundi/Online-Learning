  import mongoose from "mongoose";

  const messageSchema = new mongoose.Schema({
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

  const aiTeacherSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  });

  const AITeacher = mongoose.model("AITeacher", aiTeacherSchema);
  export default AITeacher;