"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ChatPanel } from "@/components/inbox/ChatPanel";
import { Icon } from "@/components/ui/Icon";
import { ApiError, getConversationThread, listConversations, listEscalations, sendMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Conversation, Escalation, Message } from "@/types";

export default function InboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [criticalEscalation, setCriticalEscalation] = useState<Escalation | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    listConversations()
      .then((data) => {
        if (cancelled) return;
        setConversations(data);
        setActiveId((current) => current ?? data[0]?.patientId ?? null);
      })
      .finally(() => !cancelled && setLoadingList(false));

    // Escalations are restricted server-side to doctor/nurse/superadmin —
    // front desk never has "escalations:read", so don't even attempt it.
    if (user?.role === "doctor") {
      listEscalations("OPEN")
        .then((events) => {
          if (cancelled) return;
          setCriticalEscalation(events.find((e) => e.severity === "CRITICAL") ?? null);
        })
        .catch((err) => {
          if (!(err instanceof ApiError)) throw err;
        });
    }

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    setLoadingThread(true);
    getConversationThread(activeId)
      .then((data) => !cancelled && setMessages(data))
      .finally(() => !cancelled && setLoadingThread(false));
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeId) return;
      const message = await sendMessage(activeId, text);
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((c) =>
          c.patientId === activeId
            ? { ...c, lastMessagePreview: text, lastMessageAt: message.timestamp }
            : c,
        ),
      );
    },
    [activeId],
  );

  const filteredConversations = search.trim()
    ? conversations.filter((c) =>
        (c.patientName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search),
      )
    : conversations;

  const activeConversation = conversations.find((c) => c.patientId === activeId) ?? null;

  return (
    <DashboardShell title="Inbox">
      <div className="flex-1 flex flex-col gap-6 h-full">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Unified Inbox</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Manage patient communications and leads.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Search conversations..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {criticalEscalation && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-4 shadow-sm border border-secondary/20">
            <Icon name="priority_high" className="text-secondary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-button text-button">Critical Escalation Open</h4>
              <p className="text-sm mt-1">
                {criticalEscalation.patientName ?? "A patient"} needs immediate attention:{" "}
                {criticalEscalation.sourceMessage ?? "see the escalation queue for details."}
              </p>
            </div>
            <Link
              href="/triage"
              className="bg-surface-container-lowest text-secondary px-4 py-1.5 rounded-full text-sm font-bold border border-secondary/20 hover:bg-surface transition-colors flex-shrink-0"
            >
              View in Triage
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 min-h-[600px]">
          {loadingList ? (
            <div className="lg:col-span-12 flex items-center justify-center text-on-surface-variant">
              Loading conversations...
            </div>
          ) : (
            <>
              <ConversationList
                conversations={filteredConversations}
                activeId={activeConversation?.patientId ?? ""}
                onSelect={setActiveId}
              />
              {activeConversation ? (
                <ChatPanel
                  conversation={activeConversation}
                  messages={messages}
                  loading={loadingThread}
                  onSend={handleSend}
                />
              ) : (
                <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant">
                  No conversations yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
