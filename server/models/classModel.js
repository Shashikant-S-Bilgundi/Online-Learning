import mongoose from 'mongoose'

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  track: {
    type: String,
    required: true,
    trim: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  start: {
    type: String, // HH:mm
    required: true,
  },
  end: {
    type: String, // HH:mm
    required: true,
  },
  mode: {
    type: String,
    enum: ['Live', 'Recorded'],
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    default: 0,
  },
  booked: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;
