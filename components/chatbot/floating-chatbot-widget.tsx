"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User } from "lucide-react";

export default function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello! How can I assist you with your Digital Signage platform today?",
      time: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputVal.trim(),
      time: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentText = inputVal;
    setInputVal("");

    setTimeout(() => {
      let reply = "I'm here to help with screen status, playlist schedules, or hardware support!";
      const lower = currentText.toLowerCase();
      if (lower.includes("screen") || lower.includes("display") || lower.includes("offline")) {
        reply = "You can check active screen telemetry or file a hardware ticket in the Support section.";
      } else if (lower.includes("playlist") || lower.includes("media")) {
        reply = "Playlists can be scheduled under the Playlists tab in your agent dashboard.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
          time: "Just now"
        }
      ]);
    }, 700);
  };

  const handleQuickChip = (text: string) => {
    setInputVal(text);
  };

  return (
    <>
      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[380px] h-[500px] bg-white dark:bg-[#111722] rounded-2xl border border-[#E5E7F0] dark:border-[#283243] shadow-2xl z-[9999] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#7A66F6] to-[#6853F3] text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#7A66F6] rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                </h3>
                <p className="text-[11px] text-white/80 font-mono">
                  Online • Always ready
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2.5 bg-[#F9FAFD] dark:bg-[#171F2C]/60 border-b border-[#EEF0F6] dark:border-[#283243] flex gap-2 overflow-x-auto text-[11px] scrollbar-none shrink-0">
            <button
              onClick={() => handleQuickChip("Check offline screens")}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#111722] border border-[#E2E5F0] dark:border-[#283243] hover:border-[#7A66F6] text-slate-600 dark:text-slate-300 hover:text-[#7A66F6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              🖥️ Screen Status
            </button>
            <button
              onClick={() => handleQuickChip("How to update playlist?")}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#111722] border border-[#E2E5F0] dark:border-[#283243] hover:border-[#7A66F6] text-slate-600 dark:text-slate-300 hover:text-[#7A66F6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              📅 Schedule Playlist
            </button>
            <button
              onClick={() => handleQuickChip("File support ticket")}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#111722] border border-[#E2E5F0] dark:border-[#283243] hover:border-[#7A66F6] text-slate-600 dark:text-slate-300 hover:text-[#7A66F6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              💬 Support Help
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFAFD] dark:bg-[#0D121B] text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      isBot
                        ? "bg-[#7A66F6]/15 text-[#7A66F6] border border-[#7A66F6]/20"
                        : "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                    }`}
                  >
                    {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-2xl leading-relaxed text-xs ${
                        isBot
                          ? "bg-white dark:bg-[#171F2C] text-slate-800 dark:text-slate-100 border border-[#E5E8F2] dark:border-[#283243] rounded-tl-xs shadow-2xs"
                          : "bg-[#7A66F6] text-white rounded-tr-xs shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span
                      className={`text-[9px] text-slate-400 mt-1 font-mono ${
                        isBot ? "text-left" : "text-right"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-[#111722] border-t border-[#E8EAEF] dark:border-[#283243] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#F6F7FB] dark:bg-[#171F2C] border border-[#E2E5F0] dark:border-[#283243] rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7A66F6] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-[#7A66F6] hover:bg-[#6853f3] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Bottom-Right Launcher Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#7A66F6] hover:bg-[#6853f3] text-white rounded-full shadow-lg shadow-[#7A66F6]/35 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-[9999] border border-white/20"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6 fill-white/20" />
        )}
      </button>
    </>
  );
}
