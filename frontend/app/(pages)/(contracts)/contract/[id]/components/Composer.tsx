"use client";

import { IContract } from "@/app/types/contract";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Image as ImageIcon, Loader2, Send, Smile, X } from "lucide-react";
import { MAX_IMAGES } from "../page";
import { statusLabel } from "../utils/helpers";

interface PendingImage {
  id: string;
  preview: string;
  file: File;
}

interface ComposerProps {
  canChat: boolean;
  contract: IContract;

  pendingImages: PendingImage[];

  text: string;
  setText: (value: string) => void;

  loading: {
    creating: boolean;
  };

  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  emojiRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  showEmoji: boolean;
  setShowEmoji: React.Dispatch<React.SetStateAction<boolean>>;

  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleRemoveImage: (id: string) => void;
  handleEmojiClick: (emojiData: any) => void;
  handlePickImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;

  canSend: boolean;
}

export default function Composer({
  canChat,
  contract,
  pendingImages,
  text,
  setText,
  loading,
  textareaRef,
  emojiRef,
  fileInputRef,
  showEmoji,
  setShowEmoji,
  handleKeyDown,
  handleRemoveImage,
  handleEmojiClick,
  handlePickImages,
  handleSend,
  canSend,
}: ComposerProps) {
  return (
    <div className="border-t border-white/8 p-4 sm:p-5">
      <div className="mx-auto max-w-3xl">
        {!canChat ? (
          <p className="rounded-2xl border border-white/8 bg-white/2.5 px-4 py-4 text-center text-xs text-white/30">
            This contract is {statusLabel(contract.status).toLowerCase()}.
            Messaging is closed.
          </p>
        ) : (
          <>
            <div className="relative rounded-2xl border border-white/8 bg-white/2.5 p-2 transition">
              {/* Image previews */}
              {pendingImages.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1">
                  {pendingImages.map((img) => (
                    <div
                      key={img.id}
                      className="group/preview relative h-16 w-16 overflow-hidden rounded-xl border border-white/10"
                    >
                      <img
                        src={img.preview}
                        alt={img.file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        disabled={loading.creating}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={3}
                className="w-full resize-none bg-transparent px-3 py-2 text-sm text-white outline-none"
              />

              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-1">
                  <div ref={emojiRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmoji((v) => !v)}
                      aria-label="Emoji"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/5 hover:text-white/60"
                    >
                      <Smile size={16} />
                    </button>

                    {showEmoji && (
                      <div className="absolute bottom-full left-0 z-20 mb-2">
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          theme={"dark" as Theme}
                          width={320}
                          height={380}
                          lazyLoadEmojis
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={pendingImages.length >= MAX_IMAGES}
                    aria-label="Attach images"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/5 hover:text-white/60 disabled:opacity-30"
                  >
                    <ImageIcon size={16} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handlePickImages}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-semibold text-brand-navy transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {loading.creating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {loading.creating ? "Sending..." : "Send"}
                </button>
              </div>
            </div>

            <p className="mt-2 px-2 text-[10px] text-white/15">
              Press Enter to send · Shift + Enter for a new line · Up to{" "}
              {MAX_IMAGES} images
            </p>
          </>
        )}
      </div>
    </div>
  );
}
