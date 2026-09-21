"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn, formatMessageTime } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import type { Message } from "@/types";

interface PatientCommsPanelProps {
  patientName: string;
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => Promise<void>;
  onSendVoiceNote: (blob: Blob) => Promise<void>;
}

export function PatientCommsPanel({ patientName, messages, loading, onSend, onSendVoiceNote }: PatientCommsPanelProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sendingVoiceNote, setSendingVoiceNote] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

  const stopStream = useCallback((recorder: MediaRecorder) => {
    recorder.stream.getTracks().forEach((track) => track.stop());
  }, []);

  const startRecording = async () => {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stopStream(recorder);
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        recordedChunksRef.current = [];
        if (blob.size === 0) return;
        setSendingVoiceNote(true);
        try {
          await onSendVoiceNote(blob);
        } catch {
          setRecordingError("Failed to send voice note. Please try again.");
        } finally {
          setSendingVoiceNote(false);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="lg:col-span-4 h-full">
      <div
        className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant h-full flex flex-col overflow-hidden"
        style={{ minHeight: 600 }}
      >
        <div className="bg-surface-container-low p-4 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={patientName} size={32} />
            <div className="min-w-0">
              <p className="font-button text-button text-primary leading-tight truncate">Patient Comms</p>
              <p className="text-[10px] text-on-surface-variant">WhatsApp</p>
            </div>
          </div>
          <Icon name="more_vert" className="text-on-surface-variant !text-sm" />
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-surface-container-low/30">
          {loading && <p className="text-center text-sm text-on-surface-variant">Loading conversation...</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant">No messages yet.</p>
          )}
          {messages.map((message) => {
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
                {message.type === "audio" && message.mediaUrl ? (
                  <audio controls src={message.mediaUrl} className="max-w-full h-10" />
                ) : (
                  <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                )}
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <span className={cn("text-[10px]", isStaff ? "text-primary-container/70" : "text-on-surface-variant")}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {isStaff && message.read && (
                    <Icon name="done_all" className="!text-[14px] text-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {recordingError && (
          <p className="px-3 pt-2 text-xs text-red-600 bg-surface">{recordingError}</p>
        )}
        <div className="p-3 bg-surface border-t border-surface-variant flex items-center gap-2">
          <button
            type="button"
            title={isRecording ? "Stop recording and send" : "Record a voice note"}
            className={cn(
              "p-2 rounded-full flex items-center justify-center disabled:opacity-50",
              isRecording
                ? "bg-red-100 text-red-600 animate-pulse"
                : "text-on-surface-variant hover:text-secondary",
            )}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={sendingVoiceNote}
          >
            <Icon name={isRecording ? "stop" : "mic"} className="!text-sm" />
          </button>
          <input
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full py-2 px-4 text-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none"
            placeholder={sendingVoiceNote ? "Sending voice note..." : "Type a message..."}
            type="text"
            value={draft}
            disabled={isRecording || sendingVoiceNote}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className="p-2 bg-secondary text-white rounded-full hover:opacity-90 shadow-sm flex items-center justify-center disabled:opacity-50"
            onClick={handleSend}
            disabled={sending || !draft.trim() || isRecording}
          >
            <Icon name="send" className="!text-sm" filled />
          </button>
        </div>
      </div>
    </div>
  );
}
