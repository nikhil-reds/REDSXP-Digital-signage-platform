"use client";

import React, { useState } from "react";
import { X, Calendar, Bold, Italic, Link } from "lucide-react";

interface AnnouncementFormProps {
  onClose: () => void;
  onSave: (data: {
    title: string;
    type: "Banner" | "Modal" | "Email";
    audience: string;
    message: string;
    bannerColor: string;
    scheduleEnabled: boolean;
    goLive: string;
    expires: string;
  }) => void;
}

export default function AnnouncementForm({ onClose, onSave }: AnnouncementFormProps) {
  const [title, setTitle] = useState("New AI Content Suggestions Feature");
  const [type, setType] = useState<"Banner" | "Modal" | "Email">("Banner");
  const [audience, setAudience] = useState("Growth + Business + Enterprise");
  const [message, setMessage] = useState("");
  const [bannerColor, setBannerColor] = useState("#0F7A4F");
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [goLive, setGoLive] = useState("2026-07-06T09:00");
  const [expires, setExpires] = useState("2026-07-13T09:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      type,
      audience,
      message,
      bannerColor,
      scheduleEnabled,
      goLive,
      expires
    });
  };

  return (
    <div className="flex h-full w-96 shrink-0 flex-col overflow-y-auto border-l border-app-border bg-app-surface font-sans text-app-text shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-app-border p-4">
        <div>
          <h2 className="text-body font-bold leading-snug text-app-text">
            Create / Edit Announcement
          </h2>
          <p className="mt-0.5 text-[11px] text-app-muted">
            Compose and schedule a platform broadcast
          </p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form content */}
      <form className="flex-1 space-y-4 p-4 text-caption" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Title</label>
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            required
          />
        </div>

        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Type</label>
          <div className="flex gap-2">
            {(["Banner", "Modal", "Email"] as const).map((t) => {
              const isSelected = type === t;
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 border rounded-lg text-center font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-app-accent bg-app-accent text-app-accent-on shadow-xs"
                      : "border-app-border bg-app-surface text-app-text hover:bg-app-surface-alt"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audience */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Audience</label>
          <textarea
            placeholder="All Tenants checked, or select specific plans/tenants"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="h-14 w-full resize-none rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            required
          />
        </div>

        {/* Rich message text area */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Message</label>
          <div className="flex flex-col overflow-hidden rounded-lg border border-app-border bg-app-surface-alt">
            {/* Tiny Toolbar */}
            <div className="flex items-center gap-1.5 border-b border-app-border bg-app-surface p-1.5">
              <button type="button" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md cursor-pointer">
                <Bold className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button type="button" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md cursor-pointer">
                <Italic className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button type="button" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md cursor-pointer">
                <Link className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
            {/* Input area */}
            <textarea
              placeholder="Write your announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-24 w-full resize-none bg-transparent px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none"
            />
          </div>
        </div>

        {/* Small configuration parameters grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Banner Color */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Banner Color</label>
            <input
              type="text"
              value={bannerColor}
              onChange={(e) => setBannerColor(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>

          {/* Schedule Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Schedule</label>
            <div className="flex h-9 items-center justify-between rounded-lg border border-app-border bg-app-surface-alt px-3 py-2">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Enabled</span>
              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  onChange={() => setScheduleEnabled(!scheduleEnabled)}
                  className="sr-only peer"
                />
                <div className="peer h-4 w-7 rounded-full bg-app-border after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-app-border after:bg-app-surface after:transition-all after:content-[''] peer-checked:bg-app-accent peer-checked:after:translate-x-full peer-focus:outline-none" />
              </label>
            </div>
          </div>

          {/* Go Live */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Go Live</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={goLive}
                onChange={(e) => setGoLive(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt py-2 pl-3 pr-8 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Expires */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Expires</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt py-2 pl-3 pr-8 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Buttons footer */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 select-none">
          <button
            type="button"
            className="flex-1 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer text-center"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-lg border border-app-border bg-app-surface py-2 text-center text-caption font-semibold text-app-text shadow-sm transition-colors hover:bg-app-surface-alt"
          >
            Save Draft
          </button>
          <button
            type="button"
              onClick={handleSubmit}
            className="flex-1 cursor-pointer rounded-lg bg-app-accent py-2 text-center text-caption font-semibold text-app-accent-on shadow-sm transition-colors hover:bg-app-accent-hover"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
