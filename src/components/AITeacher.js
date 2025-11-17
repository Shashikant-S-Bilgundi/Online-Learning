// src/components/AITeacher.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AITeacher({ userId }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!userId) {
      setError("Please login first to use AI Teacher.");
      return;
    }

    setLoading(true);
    setError(null);

    const userMsg = { role: "user", content: message };

    try {
      // Optimistic update: show user message immediately
      setChat((prev) => [...prev, userMsg]);
      const currentMessage = message;
      setMessage("");

      const res = await axios.post("http://localhost:3001/api/ai-teacher/ask", {
        userId,
        message: currentMessage,
      });

      const reply = res.data.reply;
      const aiMsg = { role: "assistant", content: reply };

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Teacher frontend error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to get answer from AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, loading]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50 px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 shadow-md text-white text-2xl">
            🎓
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              AI Teacher Assistant
            </h2>
            <p className="text-sm md:text-[0.9rem] text-slate-500">
              Ask doubts, get instant explanations, and learn concepts in simple language.
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md overflow-hidden">
          {/* Chat area */}
          <div className="h-80 md:h-96 overflow-y-auto bg-slate-900/90 p-4 md:p-5">
            {chat.length === 0 && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
                <div className="mb-3 text-4xl">✨</div>
                <p className="font-semibold mb-1">
                  Start a conversation with your AI Teacher
                </p>
                <p className="text-xs md:text-sm text-slate-400 mb-3 max-w-sm">
                  Try asking: <br />
                  <span className="italic">
                    “Explain photosynthesis in simple words” <br />
                    “Give me 3 practice questions on Algebra”
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-3 rounded-xl bg-red-500/10 border border-red-400/60 px-3 py-2 text-xs md:text-sm text-red-200">
                {error}
              </div>
            )}

            {chat.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={i}
                  className={`mb-3 flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs md:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-sky-500 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    <div className="mb-0.5 text-[0.65rem] uppercase tracking-wide opacity-70 font-semibold">
                      {isUser ? "You" : "AI Teacher"}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {isUser && (
                    <div className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.1s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:0.2s]"></span>
                <span className="ml-2 text-[0.7rem] text-slate-400">
                  AI Teacher is thinking...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 bg-white/90 px-3 py-3 md:px-4 md:py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI Teacher anything... (Press Enter to send, Shift+Enter for new line)"
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Thinking...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Send
                      <span className="text-xs">➤</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[0.6rem] md:text-[0.7rem] text-slate-400 px-1">
                <span>Tip: Ask concept, examples, or practice questions.</span>
                <span>Enter = Send · Shift+Enter = New line</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
