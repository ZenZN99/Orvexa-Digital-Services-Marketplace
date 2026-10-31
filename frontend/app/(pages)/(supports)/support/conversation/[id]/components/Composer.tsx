"use client";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Loader2, Paperclip, Send, Smile, X } from "lucide-react";

interface PendingAttachment {
  id: string;
  file: File;
  previewUrl: string | null;
}

interface ComposerProps {
  pendingAttachments: PendingAttachment[];
  removePendingAttachment: (id: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;

  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;

  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiClick: (emojiData: EmojiClickData) => void;

  handleSend: () => void;
  canSend: string | boolean;
  sending: boolean;
}

export default function Composer({
  pendingAttachments,
  removePendingAttachment,
  fileInputRef,
  handleFiles,
  input,
  setInput,
  textareaRef,
  handleKeyDown,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleSend,
  canSend,
  sending,
}: ComposerProps) {
  return (
    <div className="border-t border-white/8 bg-brand-navy/90 p-3.5 backdrop-blur-xl">
      {pendingAttachments.length > 0 && (
        <div className="mx-auto mb-2.5 flex max-w-2xl flex-wrap gap-2">
          {pendingAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/5"
            >
              {attachment.previewUrl ? (
                <img
                  src={attachment.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-1 text-center text-[9px] text-white/40">
                  {attachment.file.name}
                </div>
              )}

              <button
                type="button"
                onClick={() => removePendingAttachment(attachment.id)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative mx-auto flex max-w-2xl items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 text-white/50 transition hover:bg-white/5 hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip size={17} />
        </button>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="max-h-32 w-full resize-none rounded-xl border border-white/8 bg-white/4 py-2.5 pl-3.5 pr-10 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
            aria-label="Emoji"
          >
            <Smile size={18} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-20">
              <EmojiPicker theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send"
        >
          {sending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
