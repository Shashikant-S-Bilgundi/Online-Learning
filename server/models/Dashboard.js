import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: String,
  teacher: String,
  date: String,
  start: String,
  end: String,
  mode: String,
  seats: Number,
  booked: Number,
  banner: String,
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard;