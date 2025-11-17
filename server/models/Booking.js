import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 45 },
  price: { type: Number, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;