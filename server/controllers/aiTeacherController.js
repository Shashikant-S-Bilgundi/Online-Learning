import AITeacher from "../models/AITeacher.js";
import axios from "axios"; // for calling AI API (OpenAI / DeepSeek)

export const askAITeacher = async (req, res) => {
  try {
    const { userId, message } = req.body;
    console.log("AI Teacher request:", { userId, message });

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiResponse = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "HTTP-Referer": "http://localhost:3001",
      "X-Title": "Online Learning Platform AI Teacher",
    },
  }
);


    console.log("OpenAI response status:", aiResponse.status);

    const aiMessage = aiResponse.data.choices[0].message.content;

    let chat = await AITeacher.findOne({ userId });
    if (!chat) chat = new AITeacher({ userId, messages: [] });

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: aiMessage });

    await chat.save();

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error("AI Teacher Error:", error.response?.status, error.response?.data || error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await AITeacher.findOne({ userId });
    if (!chat) return res.status(404).json({ message: "No chat found" });

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};