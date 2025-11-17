import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: [optionSchema],
  answer: { type: Number, required: true }, // correct option index
  fix: { type: Number }, // optional fix for wrong answer
  explain: { type: String },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Maths", "Science"
  questions: [questionSchema],
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;