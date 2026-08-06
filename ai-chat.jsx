import React, { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      const reply =
        data?.content?.find((c) => c.type === "text")?.text ??
        "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
  };

  const milk = "#FAF9F5";

  return (
    <div
      className="h-screen w-full flex flex-col text-stone-900"
      style={{ backgroundColor: milk }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "#E8E5DD", backgroundColor: milk }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{
              background: "linear-gradient(135deg, #2B2A28 0%, #4A4844 100%)",
            }}
          >
            <span className="text-white text-[14px] font-semibold tracking-tight">
              E
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-[15px] tracking-tight text-stone-900">
              Esrael
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              AI Assistant
            </span>
          </div>
        </div>
        <button
          onClick={newChat}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors px-3 py-1.5 rounded-full border hover:shadow-sm"
          style={{ borderColor: "#E8E5DD" }}
        >
          <Plus size={14} />
          New chat
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {messages.length === 0 && (
            <div className="h-[48vh] flex flex-col items-center justify-center text-center gap-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #2B2A28 0%, #4A4844 100%)",
                }}
              >
                <span className="text-white text-2xl font-semibold">E</span>
              </div>
              <p className="text-stone-900 font-semibold text-[16px]">
                How can I help you today?
              </p>
              <p className="text-stone-400 text-sm">
                Ask me anything to get started.
              </p>
              <div
                className="text-stone-500 text-xs mt-4 max-w-sm bg-white rounded-xl px-4 py-3 border shadow-sm leading-relaxed"
                style={{ borderColor: "#E8E5DD" }}
              >
                Want to reach Esrael directly? DM on WhatsApp at{" "}
                <span className="text-stone-800 font-medium">
                  +234 0906 835 7576
                </span>
                . Need a website built? DM Esrael or email{" "}
                <span className="text-stone-800 font-medium">
                  Israelomatiga77@gmail.com
                </span>
                .
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "text-white rounded-2xl rounded-br-sm shadow-sm"
                      : "bg-white text-stone-800 rounded-2xl rounded-bl-sm border shadow-sm"
                  }`}
                  style={
                    m.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #2B2A28 0%, #4A4844 100%)",
                        }
                      : { borderColor: "#E8E5DD" }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center border shadow-sm"
                  style={{ borderColor: "#E8E5DD" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t px-6 py-4"
        style={{ borderColor: "#E8E5DD", backgroundColor: milk }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-2 bg-white rounded-3xl px-4 py-2 border shadow-sm focus-within:ring-2 focus-within:ring-stone-300 transition-shadow"
            style={{ borderColor: "#E8E5DD" }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Esrael..."
              className="flex-1 bg-transparent resize-none outline-none text-[15px] py-2 max-h-40 placeholder:text-stone-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 rounded-full disabled:bg-stone-300 flex items-center justify-center transition-colors mb-1 shadow-sm"
              style={
                !input.trim() || loading
                  ? {}
                  : {
                      background:
                        "linear-gradient(135deg, #2B2A28 0%, #4A4844 100%)",
                    }
              }
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[11px] text-stone-400 mt-2">
            The AI that tells what other AI doesn't.
          </p>
        </div>
      </div>
    </div>
  );
}
