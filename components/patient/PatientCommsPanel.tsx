"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import type { Message } from "@/types";

interface PatientCommsPanelProps {
  patientName: string;
  avatarUrl?: string;
  messages: Message[];
}

export function PatientCommsPanel({ patientName, avatarUrl, messages }: PatientCommsPanelProps) {
  const [draft, setDraft] = useState("");

  return (
    <div className="lg:col-span-4 h-full">
      <div
        className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant h-full flex flex-col overflow-hidden"
        style={{ minHeight: 600 }}
      >
        <div className="bg-surface-container-low p-4 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={patientName} src={avatarUrl} size={32} />
            <div className="min-w-0">
              <p className="font-button text-button text-primary leading-tight truncate">Patient Comms</p>
              <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
              </p>
            </div>
          </div>
          <Icon name="more_vert" className="text-on-surface-variant !text-sm" />
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-surface-container-low/30">
          <div className="text-center my-2">
            <span className="bg-surface-variant text-on-surface-variant text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
              Today
            </span>
          </div>
          {messages.map((message) => {
            if (message.sender === "system") {
              return (
                <div
                  key={message.id}
                  className="self-center bg-primary-fixed-dim/30 text-primary-container text-xs px-3 py-1.5 rounded-lg text-center max-w-[80%] border border-primary-fixed"
                >
                  {message.text}
                </div>
              );
            }
            const isStaff = message.sender === "staff";
            return (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-2xl max-w-[85%] shadow-sm relative group",
                  isStaff
                    ? "self-end bg-primary-fixed text-primary-container rounded-tr-sm"
                    : "self-start bg-white border border-surface-variant text-on-surface rounded-tl-sm",
                )}
              >
                <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                <div className={cn("flex items-center gap-1 mt-1", isStaff ? "justify-end" : "justify-end")}>
                  <span className={cn("text-[10px]", isStaff ? "text-primary-container/70" : "text-on-surface-variant")}>
                    {message.timestamp}
                  </span>
                  {isStaff && message.read && (
                    <Icon name="done_all" className="!text-[14px] text-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-surface border-t border-surface-variant flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:text-secondary rounded-full">
            <Icon name="attach_file" />
          </button>
          <input
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full py-2 px-4 text-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none"
            placeholder="Type a message..."
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            className="p-2 bg-secondary text-white rounded-full hover:opacity-90 shadow-sm flex items-center justify-center"
            onClick={() => setDraft("")}
          >
            <Icon name="send" className="!text-sm" filled />
          </button>
        </div>
      </div>
    </div>
  );
}
