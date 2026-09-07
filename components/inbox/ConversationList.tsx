import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";
import { StatusTag } from "@/components/ui/StatusTag";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const unreadCount = conversations.filter((c) => c.status === "warm_lead" || c.status === "cold_lead").length;

  return (
    <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
        <span className="font-button text-button text-primary">Recent Messages</span>
        <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-2 py-0.5 rounded-full">
          {unreadCount} New
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const active = conversation.id === activeId;
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "w-full text-left p-4 border-b border-surface-container-high cursor-pointer hover:bg-surface-container-low transition-colors",
                active && "bg-surface-bright border-l-4 border-l-secondary",
              )}
            >
              <div className="flex justify-between items-start mb-1 gap-2">
                <h5
                  className={cn(
                    "font-button text-button truncate",
                    active ? "text-primary" : "text-on-surface",
                  )}
                >
                  {conversation.patientName}
                </h5>
                <span className="text-xs text-on-surface-variant flex-shrink-0">
                  {conversation.lastMessageAt}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusTag status={conversation.status} />
                <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {conversation.language}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant truncate">
                {lastMessage?.text ?? "No messages yet"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
