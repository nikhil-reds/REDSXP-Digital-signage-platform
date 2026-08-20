"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, Mic, MicOff, Volume2, ArrowLeft } from "lucide-react";

export default function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("Listening to your voice command...");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello! How can I assist you with your Digital Signage platform today?",
      time: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");

  // Simulated voice recognition cycle when voice mode is active
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isVoiceActive) {
      setIsListening(true);
      setTranscript("Listening... Speak now");

      timer1 = setTimeout(() => {
        setTranscript('"Show me screen status for Phoenix Mall"');
      }, 2500);

      timer2 = setTimeout(() => {
        setIsListening(false);
        setTranscript('"Processing: Phoenix Mall Display is ONLINE (98.7% uptime)"');
      }, 5000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVoiceActive]);

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
              {isVoiceActive ? (
                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Back to Chat"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#7A66F6] rounded-full" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  {isVoiceActive ? "AI Voice Assistant" : "AI Assistant"}
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                </h3>
                <p className="text-[11px] text-white/80 font-mono">
                  {isVoiceActive ? (isListening ? "Listening..." : "Processing Speech") : "Online • Always ready"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsVoiceActive(false);
              }}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Render Voice Orb inside Modal Center when Voice Mode is active */}
          {isVoiceActive ? (
            <div className="flex-1 flex flex-col items-center justify-between p-6 bg-[#FAFAFD] dark:bg-[#0D121B] select-none">
              
              {/* Voice Orb Area (Center of Modal) */}
              <div className="my-auto flex flex-col items-center justify-center relative w-full">
                
                {/* Outer Glowing Pulsing Rings */}
                <div className="absolute w-44 h-44 rounded-full bg-[#7A66F6]/20 blur-xl animate-ping duration-1000 pointer-events-none" />
                <div className="absolute w-36 h-36 rounded-full bg-purple-500/25 blur-lg animate-pulse pointer-events-none" />

                {/* Core 3D Voice Orb */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-[#7A66F6] to-pink-500 p-1 shadow-[0_0_50px_rgba(122,102,246,0.6)] flex items-center justify-center animate-pulse">
                  <div className="w-full h-full rounded-full bg-slate-950/50 backdrop-blur-xs flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 via-purple-500/40 to-pink-500/30 rounded-full blur-xs animate-spin duration-3000 opacity-80" />
                    
                    <div className="relative z-10 w-11 h-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                      {isListening ? (
                        <Mic className="w-5 h-5 text-white animate-bounce" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Sound Wave Bars */}
                <div className="flex items-center gap-1 mt-6 h-6">
                  {[30, 60, 90, 50, 80, 45, 70, 25].map((height, idx) => (
                    <span
                      key={idx}
                      style={{ height: isListening ? `${height}%` : '20%' }}
                      className="w-1 bg-gradient-to-t from-[#7A66F6] to-pink-400 rounded-full transition-all duration-150 animate-pulse"
                    />
                  ))}
                </div>

                {/* Status Indicator & Live Transcript */}
                <div className="mt-5 text-center px-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A66F6]/10 border border-[#7A66F6]/20 text-[#7A66F6] dark:text-purple-300 font-mono text-[11px] mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`} />
                    <span>{isListening ? "Listening..." : "Processing Speech"}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-xs font-medium leading-relaxed italic min-h-[36px] flex items-center justify-center">
                    {transcript}
                  </p>
                </div>

              </div>

              {/* Bottom Voice Controls inside Modal */}
              <div className="w-full flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-3 rounded-full border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                    isListening
                      ? "bg-[#7A66F6] text-white border-transparent shadow-[#7A66F6]/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                  title={isListening ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="px-4 py-2 rounded-full bg-[#7A66F6]/10 hover:bg-[#7A66F6]/20 text-[#7A66F6] dark:text-purple-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Switch to Text
                </button>
              </div>

            </div>
          ) : (
            <>
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
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full pl-3.5 pr-9 py-2.5 bg-[#F6F7FB] dark:bg-[#171F2C] border border-[#E2E5F0] dark:border-[#283243] rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7A66F6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-[#7A66F6] dark:hover:text-[#7A66F6] transition-colors cursor-pointer"
                    title="Voice Assistant"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2.5 bg-[#7A66F6] hover:bg-[#6853f3] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}

      {/* Floating Bottom-Right Launcher Circle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setIsVoiceActive(false);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#7A66F6] hover:bg-[#6853f3] text-white rounded-full shadow-lg shadow-[#7A66F6]/35 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-[9999] border border-white/20"
        aria-label="Toggle Chatbot"
        title="Toggle Chatbot"
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
