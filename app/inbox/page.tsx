"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ChatPanel } from "@/components/inbox/ChatPanel";
import { Icon } from "@/components/ui/Icon";
import { conversations } from "@/lib/mockData";

export default function InboxPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const activeConversation = conversations.find((c) => c.id === activeId) ?? conversations[0];

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
              />
            </div>
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface">
              <Icon name="filter_list" />
            </button>
          </div>
        </div>

        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-4 shadow-sm border border-secondary/20">
          <Icon name="priority_high" className="text-secondary mt-0.5" />
          <div className="flex-1">
            <h4 className="font-button text-button">Urgent: Abnormal Test Results</h4>
            <p className="text-sm mt-1">
              Patient Asha K. (ID: 4892) requires immediate callback regarding recent bloodwork. Sent
              10 mins ago via WhatsApp.
            </p>
          </div>
          <button className="bg-surface-container-lowest text-secondary px-4 py-1.5 rounded-full text-sm font-bold border border-secondary/20 hover:bg-surface transition-colors flex-shrink-0">
            Action
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 min-h-[600px]">
          <ConversationList
            conversations={conversations}
            activeId={activeConversation.id}
            onSelect={setActiveId}
          />
          <ChatPanel conversation={activeConversation} />
        </div>
      </div>
    </DashboardShell>
  );
}
