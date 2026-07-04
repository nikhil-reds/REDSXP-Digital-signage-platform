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
  const [bannerColor, setBannerColor] = useState("#2457D6");
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [goLive, setGoLive] = useState("2026-07-06T09:00");
  const [expires, setExpires] = useState("2026-07-13T09:00");

  const handleSubmit = (e: React.FormEvent, isPublish: boolean) => {
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
    <div className="w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full font-sans shadow-xl shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            Create / Edit Announcement
          </h2>
          <p className="text-[11px] text-zinc-450 dark:text-zinc-500 mt-0.5">
            Compose and schedule a platform broadcast
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-405 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-805 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form content */}
      <form className="p-4 space-y-4 flex-1 text-xs" onSubmit={(e) => handleSubmit(e, false)}>
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Title</label>
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            required
          />
        </div>

        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Type</label>
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
                      ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50 shadow-xs"
                      : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-805 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
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
          <label className="font-semibold text-zinc-500">Audience</label>
          <textarea
            placeholder="All Tenants checked, or select specific plans/tenants"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full h-14 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Rich message text area */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Message</label>
          <div className="border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
            {/* Tiny Toolbar */}
            <div className="flex items-center gap-1.5 p-1.5 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50">
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
              className="w-full h-24 px-3 py-2 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Small configuration parameters grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Banner Color */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Banner Color</label>
            <input
              type="text"
              value={bannerColor}
              onChange={(e) => setBannerColor(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {/* Schedule Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Schedule</label>
            <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg h-9">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Enabled</span>
              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  onChange={() => setScheduleEnabled(!scheduleEnabled)}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-850 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-zinc-950 dark:peer-checked:bg-zinc-100" />
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
                className="w-full pl-3 pr-8 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
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
                className="w-full pl-3 pr-8 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
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
            className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer text-center"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer text-center"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
