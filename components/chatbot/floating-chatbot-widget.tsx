"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Check, ChevronDown, Copy, MessageSquare, RotateCcw, Send, Square, Trash2, User, X } from "lucide-react";
import { SkeletonText } from "@/components/ui/skeleton";

type Card = { title: string; subtitle?: string; badge?: string; href?: string };
type MessageStatus = "complete" | "sending" | "waiting" | "streaming" | "failed" | "cancelled";
type ChatMsg = { id: string; sender: "bot" | "user"; text: string; time: string; status: MessageStatus; cards?: Card[]; error?: string; retryPrompt?: string };

const STORAGE_KEY = "reds-assistant-conversation-v1";
const INITIAL_MESSAGE: ChatMsg = { id: "welcome", sender: "bot", text: "What can I help with? I can check screens, schedules, playlists, media, and alerts.", time: "Just now", status: "complete" };
const quickChips = [{ label: "Screen Status", prompt: "Check offline screens" }, { label: "Schedule Playlist", prompt: "How do I update a playlist?" }, { label: "Support Help", prompt: "How can I get support?" }];
const makeId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const isActive = (status: MessageStatus) => status === "sending" || status === "waiting" || status === "streaming";

function restoreMessages(): ChatMsg[] {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (!Array.isArray(parsed) || !parsed.every((message) => message && typeof message === "object" && typeof message.text === "string" && (message.sender === "bot" || message.sender === "user"))) return [INITIAL_MESSAGE];
    return parsed.map((message) => {
      const item = message as ChatMsg;
      return { ...item, status: isActive(item.status) ? "cancelled" : item.status ?? "complete" };
    });
  } catch { return [INITIAL_MESSAGE]; }
}

export default function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasNewResponse, setHasNewResponse] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const skeletonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeMessage = messages.find((message) => message.sender === "bot" && isActive(message.status));
  const isGenerating = Boolean(activeMessage);

  useEffect(() => { setMessages(restoreMessages()); setIsHydrated(true); }, []);
  useEffect(() => { if (isHydrated) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [isHydrated, messages]);
  useEffect(() => () => { controllerRef.current?.abort(); if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current); }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior });
    setHasNewResponse(false);
  }, []);
  useEffect(() => { if (isOpen && isNearBottom) scrollToBottom(); }, [isOpen, isNearBottom, messages, scrollToBottom]);
  const updateMessage = useCallback((id: string, fn: (message: ChatMsg) => ChatMsg) => setMessages((current) => current.map((message) => message.id === id ? fn(message) : message)), []);
  const resizeComposer = () => { const textarea = textareaRef.current; if (!textarea) return; textarea.style.height = "auto"; textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`; };

  const sendPrompt = useCallback(async (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt || prompt.length > 2000 || controllerRef.current) return;
    const userMessage: ChatMsg = { id: makeId(), sender: "user", text: prompt, time: "Just now", status: "complete" };
    const assistantId = makeId();
    const pending: ChatMsg = { id: assistantId, sender: "bot", text: "", time: "", status: "sending", retryPrompt: prompt };
    const history = [...messages, userMessage].filter((message) => message.status === "complete" && message.text).slice(-12).map((message) => ({ role: message.sender === "bot" ? "assistant" : "user", text: message.text }));
    setMessages((current) => [...current, userMessage, pending]);
    setInputVal("");
    requestAnimationFrame(() => { resizeComposer(); textareaRef.current?.focus(); scrollToBottom("smooth"); });
    const controller = new AbortController();
    controllerRef.current = controller;
    skeletonTimerRef.current = setTimeout(() => updateMessage(assistantId, (message) => message.status === "sending" ? { ...message, status: "waiting" } : message), 800);
    try {
      const response = await fetch("/api/agent/assistant", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" }, body: JSON.stringify({ messages: history }), signal: controller.signal });
      if (!response.ok || !response.body) { const body = await response.json().catch(() => null); throw new Error(body?.message || "The assistant is unavailable right now. Please try again."); }
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let receivedText = false;
      const handleEvent = (line: string) => {
        if (!line) return;
        const event = JSON.parse(line) as { type: "delta" | "cards" | "complete" | "error"; text?: string; cards?: Card[]; message?: string };
        if (event.type === "delta" && event.text) { receivedText = true; if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current); updateMessage(assistantId, (message) => ({ ...message, text: message.text + event.text!, status: "streaming" })); if (!isNearBottom) setHasNewResponse(true); }
        if (event.type === "cards" && event.cards) updateMessage(assistantId, (message) => ({ ...message, cards: event.cards }));
        if (event.type === "complete") updateMessage(assistantId, (message) => ({ ...message, status: "complete", time: "Just now" }));
        if (event.type === "error") throw new Error(event.message || "The assistant could not finish this response.");
      };
      while (true) { const { done, value } = await reader.read(); buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; lines.forEach(handleEvent); if (done) break; }
      if (buffer) handleEvent(buffer);
      if (!receivedText) throw new Error("The assistant did not return a response. Please try again.");
    } catch (error) {
      const cancelled = controller.signal.aborted;
      updateMessage(assistantId, (message) => ({ ...message, status: cancelled ? "cancelled" : "failed", time: message.text ? "Just now" : "", error: cancelled ? "Response stopped." : error instanceof Error ? error.message : "Something went wrong. Please try again." }));
    } finally { if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current); skeletonTimerRef.current = null; if (controllerRef.current === controller) controllerRef.current = null; }
  }, [isNearBottom, messages, scrollToBottom, updateMessage]);

  const clearConversation = () => { if (messages.length > 1 && !window.confirm("Clear this conversation?")) return; controllerRef.current?.abort(); setMessages([INITIAL_MESSAGE]); setHasNewResponse(false); window.sessionStorage.removeItem(STORAGE_KEY); };
  const copyMessage = async (message: ChatMsg) => { await navigator.clipboard.writeText(message.text); setCopiedId(message.id); window.setTimeout(() => setCopiedId(null), 1600); };
  const onScroll = () => { const element = scrollRef.current; if (!element) return; const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 48; setIsNearBottom(nearBottom); if (nearBottom) setHasNewResponse(false); };

  return <>
    {isOpen && <section aria-label="AI Assistant" className="fixed inset-x-3 bottom-20 z-[9999] flex h-[min(680px,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[390px]">
      <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-reds-green to-reds-teal p-4 text-reds-black"><div className="flex items-center gap-3"><div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-reds-black/20 bg-reds-black/10"><Bot className="h-5 w-5" /><span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-reds-green bg-reds-black ${isGenerating ? "animate-pulse" : ""}`} /></div><div><h2 className="font-heading text-lead font-semibold tracking-headline">AI Assistant</h2><p className="text-caption">{isGenerating ? "Responding…" : "Online · Always ready"}</p></div></div><div className="flex gap-1"><button type="button" onClick={clearConversation} className="rounded-lg p-1.5 hover:bg-reds-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-black" aria-label="Clear conversation" title="Clear conversation"><Trash2 className="h-4 w-4" /></button><button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 hover:bg-reds-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-black" aria-label="Close chat"><X className="h-4 w-4" /></button></div></header>
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-app-border bg-app-surface-alt px-4 py-2.5">{quickChips.map((chip) => <button key={chip.label} type="button" disabled={isGenerating} onClick={() => void sendPrompt(chip.prompt)} className="whitespace-nowrap rounded-full border border-app-border bg-app-surface px-2.5 py-1 text-caption text-app-muted hover:border-app-accent-text hover:text-app-accent-text disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-app-accent-text">{chip.label}</button>)}</div>
      <div ref={scrollRef} onScroll={onScroll} className="chat-scrollbar flex-1 space-y-3.5 overflow-y-auto bg-app-canvas p-4 pb-6" role="log" aria-live="polite" aria-relevant="additions text">{messages.map((message) => <MessageRow key={message.id} message={message} copied={copiedId === message.id} onCopy={copyMessage} onRetry={(prompt) => { if (prompt) void sendPrompt(prompt); }} />)}</div>
      {hasNewResponse && <button type="button" onClick={() => scrollToBottom("smooth")} className="absolute bottom-[76px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-accent-text shadow-lg focus-visible:outline-2 focus-visible:outline-app-accent-text"><ChevronDown className="h-3.5 w-3.5" />New response</button>}
      <form onSubmit={(event) => { event.preventDefault(); void sendPrompt(inputVal); }} className="flex shrink-0 items-end gap-2 border-t border-app-border bg-app-surface p-3"><textarea ref={textareaRef} value={inputVal} rows={1} maxLength={2000} disabled={isGenerating} onChange={(event) => { setInputVal(event.target.value); resizeComposer(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (inputVal.trim()) void sendPrompt(inputVal); } }} placeholder="Type your message…" aria-label="Message to AI Assistant" className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-app-border bg-app-surface-alt px-3.5 py-2.5 text-body text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text disabled:cursor-not-allowed disabled:opacity-60" />{isGenerating ? <button type="button" onClick={() => controllerRef.current?.abort()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-danger text-app-danger-on hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-danger" aria-label="Stop generating" title="Stop generating"><Square className="h-4 w-4 fill-current" /></button> : <button type="submit" disabled={!inputVal.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-accent text-app-accent-on hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent-text" aria-label="Send message"><Send className="h-4 w-4" /></button>}</form>
    </section>}
    <button type="button" onClick={() => setIsOpen((open) => !open)} className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-app-accent text-app-accent-on shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent-text active:scale-95" aria-label={isOpen ? "Close chatbot" : "Open chatbot"}>{isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}</button>
  </>;
}

function MessageRow({ message, copied, onCopy, onRetry }: { message: ChatMsg; copied: boolean; onCopy: (message: ChatMsg) => void; onRetry: (prompt?: string) => void }) {
  const bot = message.sender === "bot"; const loading = isActive(message.status);
  return <div className={`group flex max-w-[88%] items-start gap-2.5 ${bot ? "mr-auto" : "ml-auto flex-row-reverse"}`}><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${bot ? "border-app-border bg-app-accent-surface text-app-accent-text" : "border-transparent bg-app-bubble-user text-app-bubble-user-on"}`}>{bot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}</div><div className="min-w-0 max-w-full flex-1"><div className={`max-w-full overflow-hidden rounded-2xl p-3 text-body ${message.status === "failed" ? "border border-app-danger/40 bg-app-danger-surface text-app-danger-text" : bot ? "rounded-tl-xs border border-app-border bg-app-surface text-app-text" : "rounded-tr-xs bg-app-bubble-user text-app-bubble-user-on"}`}>{loading && !message.text ? <LoadingReply skeleton={message.status === "waiting"} /> : <><span className="whitespace-pre-wrap break-words">{message.text}</span>{message.status === "streaming" && <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-app-accent-text align-[-2px]" />}{message.error && <><p className="mt-2 text-caption font-semibold">{message.error}</p><button type="button" onClick={() => onRetry(message.retryPrompt)} className="mt-2 inline-flex items-center gap-1 rounded-md border border-current px-2 py-1 text-caption font-semibold hover:bg-app-surface/40 focus-visible:outline-2 focus-visible:outline-app-accent-text"><RotateCcw className="h-3.5 w-3.5" />Try again</button></>}</>}</div>{message.cards?.length ? <div className="mt-1.5 flex flex-col gap-1.5">{message.cards.slice(0, 6).map((card, index) => { const content = <><div className="flex items-center justify-between gap-2"><span className="truncate text-caption font-semibold text-app-text">{card.title}</span>{card.badge && <span className="shrink-0 rounded-full bg-app-accent-surface px-1.5 py-0.5 text-caption font-semibold text-app-accent-text">{card.badge}</span>}</div>{card.subtitle && <p className="mt-0.5 truncate text-caption text-app-muted">{card.subtitle}</p>}</>; return card.href ? <a key={`${card.title}-${index}`} href={card.href} className="block rounded-lg border border-app-border bg-app-surface p-2 hover:border-app-accent-text focus-visible:outline-2 focus-visible:outline-app-accent-text">{content}</a> : <div key={`${card.title}-${index}`} className="rounded-lg border border-app-border bg-app-surface p-2">{content}</div>; })}</div> : null}{(message.time || message.status === "cancelled" || message.status === "failed") && <div className={`mt-1 flex items-center gap-1 text-caption text-app-muted ${bot ? "justify-start" : "justify-end"}`}><span>{message.status === "cancelled" ? "Stopped" : message.time}</span>{bot && !loading && message.text && <><button type="button" onClick={() => void onCopy(message)} className="invisible rounded p-0.5 hover:text-app-accent-text group-hover:visible focus:visible focus-visible:outline-2 focus-visible:outline-app-accent-text" aria-label="Copy response" title="Copy response">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>{(message.status === "failed" || message.status === "cancelled") && <button type="button" onClick={() => onRetry(message.retryPrompt)} className="invisible rounded p-0.5 hover:text-app-accent-text group-hover:visible focus:visible focus-visible:outline-2 focus-visible:outline-app-accent-text" aria-label="Retry response" title="Retry response"><RotateCcw className="h-3.5 w-3.5" /></button>}</>}</div>}</div></div>;
}

function LoadingReply({ skeleton }: { skeleton: boolean }) {
  return skeleton ? <SkeletonText lines={3} className="max-w-full w-64" /> : <span className="flex gap-1" aria-label="AI Assistant is typing"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-muted [animation-delay:-0.2s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-muted [animation-delay:-0.1s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-muted" /></span>;
}
