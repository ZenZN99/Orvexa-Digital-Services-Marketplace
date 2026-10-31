"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useMessages } from "@/app/hooks/useMessages";
import { useContracts } from "@/app/hooks/useContracts";
import { ContractStatus } from "@/app/types/contract";
import type { IMessage } from "@/app/types/message";
import { UserRole, type IUser } from "@/app/types/user";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { formatDayLabel } from "./utils/helpers";
import TopNavigation from "./components/TopNavigation";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import Messages from "./components/Messages";
import Composer from "./components/Composer";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import Skeleton from "./components/Skeleton";
import ContractNotFound from "@/app/(pages)/(reviews)/review/[id]/components/ContractNotFound";

export const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const POLL_INTERVAL = 10_000;

interface PendingImage {
  id: string;
  file: File;
  preview: string;
}

export default function ContractMessagesPage() {
  const params = useParams<{ id: string }>();
  const contractId = params.id;
  const router = useRouter();

  const { currentUser } = useAuthStore();

  const {
    contract,
    fetchContractById,
    completeContract,
    deliverContract,
    loading: contractLoading,
  } = useContracts();
  const {
    myMessages,
    loading: messageLoading,
    createMessage,
    deleteMessage,
    fetchMyMessages,
  } = useMessages(1, 10, contractId);

  const [text, setText] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<PendingImage[]>([]);

  pendingRef.current = pendingImages;

  useEffect(() => {
    if (!contractId) return;

    fetchContractById(contractId);
  }, [contractId]);

useEffect(() => {
  const interval = setInterval(() => {
    fetchMyMessages();
    if (contractId) fetchContractById(contractId);
  }, POLL_INTERVAL);

  return () => clearInterval(interval);
}, [fetchMyMessages, contractId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [myMessages.length]);

  useEffect(() => {
    if (!showEmoji) return;

    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const currentUserId = currentUser?.id;
  const isClient = contract?.clientId === currentUserId;

  const otherUser: IUser | undefined = useMemo(() => {
    if (!contract) return undefined;
    return isClient
      ? ((contract.freelancer as any)?.user as IUser | undefined)
      : contract.client;
  }, [contract, isClient]);

  const canChat = contract?.status === ContractStatus.IN_PROGRESS;

  const groupedMessages = useMemo(() => {
    const groups: { day: string; items: IMessage[] }[] = [];

    myMessages.forEach((m) => {
      const day = formatDayLabel(m.createdAt);
      const last = groups[groups.length - 1];

      if (last && last.day === day) last.items.push(m);
      else groups.push({ day, items: [m] });
    });

    return groups;
  }, [myMessages]);

  const handlePickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file

    if (selected.length === 0) return;

    const valid: PendingImage[] = [];
    const available = MAX_IMAGES - pendingImages.length;

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }

      if (valid.length >= available) {
        toast.error(`You can attach up to ${MAX_IMAGES} images`);
        break;
      }

      valid.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (valid.length) setPendingImages((prev) => [...prev, ...valid]);
  };

  const handleRemoveImage = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    const el = textareaRef.current;

    if (!el) {
      setText((t) => t + emoji.emoji);
      return;
    }

    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;

    setText(text.slice(0, start) + emoji.emoji + text.slice(end));

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSend = async () => {
    const content = text.trim();

    if (
      (!content && pendingImages.length === 0) ||
      messageLoading.creating ||
      !canChat
    ) {
      return;
    }

    const res = await createMessage(
      contractId,
      content || undefined,
      pendingImages.map((img) => img.file),
    );

    if (res) {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setPendingImages([]);
      setText("");
      setShowEmoji(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReceiveService = async () => {
    if (!contract) return;

    const result = await completeContract(contract.id);
    if (result) {
      router.push(`/review/${contract.id}`);
    }
  };

  const handleDeliverContract = async () => {
    if (!contract) return;

    await deliverContract(contract.id);
  };

  if (contractLoading.global || !contract) {
    return <Skeleton />;
  }

  if (!contract) {
    return <ContractNotFound />;
  }

  const canSend =
    (text.trim().length > 0 || pendingImages.length > 0) &&
    !messageLoading.creating;

  return (
    <ProtectedRoute roles={[UserRole.CLIENT, UserRole.FREELANCER]}>
      <main className="min-h-screen bg-brand-navy text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <TopNavigation />

          <div className="grid h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-white/8 bg-white/2 lg:grid-cols-[320px_1fr]">
            <Sidebar
              canChat={canChat}
              contract={contract}
              isClient={isClient}
              otherUser={otherUser}
              handleReceiveService={handleReceiveService}
              handleDeliverContract={handleDeliverContract}
              loading={{
                completing: contractLoading.completing,
                delivering: contractLoading.delivering,
              }}
              open={showDetails}
              onClose={() => setShowDetails(false)}
            />

            <section className="flex min-h-0 flex-col">
              {/* Contract details toggle (small screens only) */}
              <div className="border-b border-white/8 px-4 py-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/7 bg-white/2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <Info size={16} />
                  Contract details
                </button>
              </div>

              <ChatHeader
                otherUser={otherUser}
                canChat={canChat}
                contract={contract}
              />

              <Messages
                myMessages={myMessages}
                groupedMessages={groupedMessages}
                currentUserId={currentUserId}
                canChat={canChat}
                loading={messageLoading}
                deleteMessage={deleteMessage}
                bottomRef={bottomRef}
              />
              <Composer
                canChat={canChat}
                contract={contract}
                pendingImages={pendingImages}
                text={text}
                setText={setText}
                loading={messageLoading}
                textareaRef={textareaRef}
                emojiRef={emojiRef}
                fileInputRef={fileInputRef}
                showEmoji={showEmoji}
                setShowEmoji={setShowEmoji}
                handleKeyDown={handleKeyDown}
                handleRemoveImage={handleRemoveImage}
                handleEmojiClick={handleEmojiClick}
                handlePickImages={handlePickImages}
                handleSend={handleSend}
                canSend={canSend}
              />
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
