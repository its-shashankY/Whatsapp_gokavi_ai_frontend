"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { Icon } from "@/components/ui/Icon";
import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

interface ChatPanelProps {
  conversation: Conversation;
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => Promise<void>;
}

export function ChatPanel({ conversation, messages, loading, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await onSend(text);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm ambient-shadow">
      <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright gap-3 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar name={conversation.patientName ?? "?"} size={48} />
          <div className="min-w-0">
            <h3 className="font-headline-md text-headline-md text-primary text-xl truncate">
              {conversation.patientName ?? "Unknown Contact"}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-on-surface-variant">{conversation.phone}</span>
              <span className="mx-1 text-outline-variant">•</span>
              <StatusTag status={conversation.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/patients/${conversation.patientId}`}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"
            title="View Patient Profile"
          >
            <Icon name="person" />
          </Link>
          <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface transition-colors" title="More Options">
            <Icon name="more_vert" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F7] relative">
        <div className="flex flex-col gap-4 relative z-10">
          {loading && <p className="text-center text-sm text-on-surface-variant">Loading conversation...</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant">No messages in this conversation yet.</p>
          )}
          {messages.map((message) => {
            const isStaff = message.sender === "staff";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  isStaff ? "items-end self-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-2xl shadow-sm",
                    isStaff
                      ? "bg-primary-container text-on-primary-container rounded-tr-sm"
                      : "bg-white text-on-surface border border-outline-variant/30 rounded-tl-sm",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                </div>
                <span
                  className={cn(
                    "text-xs text-on-surface-variant mt-1",
                    isStaff ? "mr-1" : "ml-1",
                  )}
                >
                  {formatMessageTime(message.timestamp)}
                  {message.read ? " • Read" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-outline-variant bg-surface-bright flex gap-3 items-end">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low mb-1">
          <Icon name="attach_file" />
        </button>
        <div className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all overflow-hidden flex flex-col">
          <textarea
            className="w-full bg-transparent border-none resize-none p-3 text-body-md focus:ring-0 text-on-surface outline-none"
            placeholder="Type a message..."
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex justify-between items-center px-3 pb-2 flex-wrap gap-2">
            <span className="text-xs text-outline">
              {sending ? "Sending..." : "Press Enter to send"}
            </span>
          </div>
        </div>
        <button
          className="p-3 bg-secondary text-on-secondary rounded-xl shadow-[0_4px_14px_0_rgba(169,51,73,0.39)] hover:opacity-90 transition-opacity mb-1 flex items-center justify-center disabled:opacity-50"
          onClick={handleSend}
          disabled={sending || !draft.trim()}
        >
          <Icon name="send" />
        </button>
      </div>
    </div>
  );
}
