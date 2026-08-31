"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, Mic, MicOff, Volume2, ArrowLeft } from "lucide-react";

type Card = { title: string; subtitle?: string; badge?: string; href?: string };

type ChatMsg = {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  cards?: Card[];
  isError?: boolean;
};

export default function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("Listening to your voice command…");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! Ask me about screens, schedules, playlists, media, or alerts — I can look things up for you.",
      time: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Simulated voice recognition cycle when voice mode is active
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isVoiceActive) {
      setIsListening(true);
      setTranscript("Listening… Speak now");

      timer1 = setTimeout(() => {
        setTranscript("“Show me screen status for Phoenix Mall”");
      }, 2500);

      timer2 = setTimeout(() => {
        setIsListening(false);
        setTranscript("“Processing: Phoenix Mall Display is ONLINE (98.7% uptime)”");
      }, 5000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVoiceActive]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputVal.trim(),
      time: "Just now"
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputVal("");
    setIsSending(true);

    try {
      const res = await fetch("/api/agent/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.sender === "bot" ? "assistant" : "user", text: m.text })),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json?.message || "The assistant is unavailable right now.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: json.data.reply,
          cards: json.data.cards,
          time: "Just now"
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: error instanceof Error ? error.message : "Something went wrong. Please try again.",
          time: "Just now",
          isError: true
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickChip = (text: string) => {
    setInputVal(text);
  };

  const quickChips = [
    { label: "Screen Status", prompt: "Check offline screens" },
    { label: "Schedule Playlist", prompt: "How to update playlist?" },
    { label: "Support Help", prompt: "File support ticket" },
  ];

  return (
    <>
      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[380px] h-[500px] bg-app-surface rounded-2xl border border-app-border shadow-2xl z-[9999] flex flex-col overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-5 duration-200">

          {/* Header — approved brand gradient (Green 60 → Teal). Black label
              clears 7.73:1 at the green end and 6.15:1 at the teal end. */}
          <div className="p-4 bg-gradient-to-r from-reds-green to-reds-teal text-reds-black flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              {isVoiceActive ? (
                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="p-1 rounded-lg hover:bg-reds-black/10 text-reds-black transition-colors cursor-pointer"
                  title="Back to Chat"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-reds-black/10 flex items-center justify-center text-reds-black border border-reds-black/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-reds-black border-2 border-reds-green rounded-full" />
                </div>
              )}
              <div>
                <h3 className="font-heading text-lead font-semibold tracking-headline text-reds-black flex items-center gap-1.5">
                  {isVoiceActive ? "AI Voice Assistant" : "AI Assistant"}
                  <Sparkles className="w-3.5 h-3.5" />
                </h3>
                {/* Full opacity: at 80% this drops to 4.32:1 over the teal end
                    of the gradient. Hierarchy comes from size, not alpha. */}
                <p className="text-caption text-reds-black">
                  {isVoiceActive ? (isListening ? "Listening…" : "Processing speech") : "Online • Always ready"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsVoiceActive(false);
              }}
              className="p-1.5 rounded-lg hover:bg-reds-black/10 text-reds-black transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Render Voice Orb inside Modal Center when Voice Mode is active */}
          {isVoiceActive ? (
            <div className="flex-1 flex flex-col items-center justify-between p-6 bg-app-canvas select-none">

              {/* Voice Orb Area (Center of Modal) */}
              <div className="my-auto flex flex-col items-center justify-center relative w-full">

                {/* Outer Glowing Pulsing Rings — Green/Teal only */}
                <div className="absolute w-44 h-44 rounded-full bg-reds-green/20 blur-xl animate-ping duration-1000 pointer-events-none" />
                <div className="absolute w-36 h-36 rounded-full bg-reds-teal/25 blur-lg animate-pulse pointer-events-none" />

                {/* Core Voice Orb — approved 3-colour combination Green/Teal/Blue */}
                <div
                  className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-reds-green via-reds-teal to-reds-blue p-1 flex items-center justify-center animate-pulse"
                  style={{ boxShadow: "0 0 50px color-mix(in srgb, var(--reds-green-60) 45%, transparent)" }}
                >
                  <div className="w-full h-full rounded-full bg-reds-black flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-reds-green/25 via-reds-teal/30 to-reds-blue/25 rounded-full blur-xs opacity-80" />

                    <div className="relative z-10 w-11 h-11 rounded-full bg-reds-black border border-reds-green/40 flex items-center justify-center text-reds-green shadow-inner">
                      {isListening ? (
                        <Mic className="w-5 h-5 animate-bounce" />
                      ) : (
                        <Volume2 className="w-5 h-5 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Sound Wave Bars */}
                <div className="flex items-center gap-1 mt-6 h-6">
                  {[30, 60, 90, 50, 80, 45, 70, 25].map((height, idx) => (
                    <span
                      key={idx}
                      style={{ height: isListening ? `${height}%` : "20%" }}
                      className="w-1 bg-gradient-to-t from-reds-green to-reds-teal rounded-full transition-all duration-150 animate-pulse"
                    />
                  ))}
                </div>

                {/* Status Indicator & Live Transcript */}
                <div className="mt-5 text-center px-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-app-accent-surface border border-app-border text-app-accent-text text-caption font-semibold mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full bg-app-accent-text ${isListening ? "animate-ping" : ""}`} />
                    <span>{isListening ? "Listening…" : "Processing speech"}</span>
                  </div>
                  <p className="text-app-text text-body min-h-[36px] flex items-center justify-center">
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
                      ? "bg-app-accent text-app-accent-on border-transparent"
                      : "bg-app-surface-alt text-app-muted border-app-border"
                  }`}
                  title={isListening ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="px-4 py-2 rounded-full bg-app-accent-surface hover:bg-app-surface-alt text-app-accent-text text-body font-semibold transition-colors cursor-pointer"
                >
                  Switch to Text
                </button>
              </div>

            </div>
          ) : (
            <>
              {/* Quick Suggestion Chips */}
              <div className="px-4 py-2.5 bg-app-surface-alt border-b border-app-border flex gap-2 overflow-x-auto shrink-0">
                {quickChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleQuickChip(chip.prompt)}
                    className="px-2.5 py-1 rounded-full bg-app-surface border border-app-border hover:border-app-accent-text text-app-muted hover:text-app-accent-text text-caption transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-app-canvas">
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
                        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                          isBot
                            ? "bg-app-accent-surface text-app-accent-text border border-app-border"
                            : "bg-app-bubble-user text-app-bubble-user-on"
                        }`}
                      >
                        {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex flex-col">
                        <div
                          className={`p-3 rounded-2xl text-body ${
                            msg.isError
                              ? "bg-app-danger-surface text-app-danger-text border border-app-danger/40 rounded-tl-xs"
                              : isBot
                              ? "bg-app-surface text-app-text border border-app-border rounded-tl-xs"
                              : "bg-app-bubble-user text-app-bubble-user-on rounded-tr-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.cards && msg.cards.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-1.5">
                            {msg.cards.slice(0, 6).map((card, idx) => {
                              const content = (
                                <>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-caption font-semibold text-app-text truncate">
                                      {card.title}
                                    </span>
                                    {card.badge && (
                                      <span className="text-caption px-1.5 py-0.5 rounded-full bg-app-accent-surface text-app-accent-text font-semibold shrink-0 leading-none">
                                        {card.badge}
                                      </span>
                                    )}
                                  </div>
                                  {card.subtitle && (
                                    <p className="text-caption text-app-muted mt-0.5 truncate">
                                      {card.subtitle}
                                    </p>
                                  )}
                                </>
                              );
                              const cls =
                                "block p-2 rounded-lg bg-app-surface border border-app-border";
                              return card.href ? (
                                <a key={idx} href={card.href} className={`${cls} hover:border-app-accent-text transition-colors`}>
                                  {content}
                                </a>
                              ) : (
                                <div key={idx} className={cls}>
                                  {content}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <span
                          className={`text-caption text-app-muted mt-1 ${
                            isBot ? "text-left" : "text-right"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isSending && (
                  <div className="flex items-center gap-2.5 max-w-[85%] mr-auto">
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-app-accent-surface text-app-accent-text border border-app-border">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-xs bg-app-surface border border-app-border flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-app-muted animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-app-muted animate-bounce [animation-delay:-0.1s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-app-muted animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Chat Input Form */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-app-surface border-t border-app-border flex items-center gap-2 shrink-0"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message…"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={isSending}
                    className="w-full pl-3.5 pr-9 py-2.5 bg-app-surface-alt border border-app-border rounded-xl text-body text-app-text placeholder-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-colors disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="absolute right-2.5 p-1 text-app-muted hover:text-app-accent-text transition-colors cursor-pointer"
                    title="Voice Assistant"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isSending}
                  className="p-2.5 bg-app-accent text-app-accent-on hover:opacity-90 disabled:opacity-40 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-app-accent text-app-accent-on rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-[9999]"
        aria-label="Toggle Chatbot"
        title="Toggle Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
