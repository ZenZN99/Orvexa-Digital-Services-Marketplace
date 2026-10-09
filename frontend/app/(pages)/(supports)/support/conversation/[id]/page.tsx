"use client";

import { useParams } from "next/navigation";
import { EmojiClickData } from "emoji-picker-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSupportConversations } from "@/app/hooks/useSupportConversations";
import { useSupportMessages } from "@/app/hooks/useSupportMessages";
import { useAuthStore } from "@/app/stores/useAuthStore";
import Header from "./components/Header";
import Messages from "./components/Messages";
import Composer from "./components/Composer";
import { isImageFile, isStaff } from "./utils/helpers";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import ClosedConversation from "./components/ClosedConversation";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import Skeleton from "./components/Skeleton";

interface PendingAttachment {
  id: string;
  file: File;
  previewUrl: string | null;
}

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const { currentUser } = useAuthStore();

  const {
    conversation,
    fetchConversationById,
    loading: conversationLoading,
  } = useSupportConversations();
  const {
    messages,
    loading: messageLoading,
    createMessage,
    deleteMessage,
    markAllAsRead,
  } = useSupportMessages(conversationId);

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<
    PendingAttachment[]
  >([]);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = !sending && (input.trim() || pendingAttachments.length > 0);

  useEffect(() => {
    if (!conversationId) return;
    fetchConversationById(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) markAllAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    if (pendingAttachments.length + files.length > 5) {
      event.target.value = "";
      return;
    }

    const newAttachments: PendingAttachment[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: isImageFile(file) ? URL.createObjectURL(file) : null,
    }));

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    event.target.value = "";
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => {
      const attachment = prev.find((item) => item.id === id);
      if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSend = async () => {
    if (!canSend) return;

    setSending(true);

    const result = await createMessage(
      input.trim() || undefined,
      pendingAttachments.map((a) => a.file),
    );

    if (result) {
      setInput("");
      pendingAttachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
      setPendingAttachments([]);
      setShowEmojiPicker(false);
    }

    setSending(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const otherPartyLabel = useMemo(() => {
    const lastStaffMsg = [...messages]
      .reverse()
      .find((m) => isStaff(m.sender?.role));
    return lastStaffMsg?.sender
      ? `${lastStaffMsg.sender.firstName} ${lastStaffMsg.sender.lastName}`
      : "Support";
  }, [messages]);

  if (!currentUser) return null;

  if (conversationLoading.conversation) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute>
      <main className="relative flex h-dvh flex-col overflow-hidden bg-brand-navy text-white">
        {conversation?.status === SupportConversationStatus.OPEN ? (
          <>
            <Header
              otherPartyLabel={otherPartyLabel}
              conversation={conversation}
            />

            <Messages
              messages={messages}
              currentUser={currentUser}
              loading={messageLoading}
              deleteMessage={deleteMessage}
              messagesEndRef={messagesEndRef}
            />

            <Composer
              pendingAttachments={pendingAttachments}
              removePendingAttachment={removePendingAttachment}
              fileInputRef={fileInputRef}
              handleFiles={handleFiles}
              input={input}
              setInput={setInput}
              textareaRef={textareaRef}
              handleKeyDown={handleKeyDown}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              handleEmojiClick={handleEmojiClick}
              handleSend={handleSend}
              canSend={canSend}
              sending={sending}
            />
          </>
        ) : (
          <ClosedConversation />
        )}
      </main>
    </ProtectedRoute>
  );
}
