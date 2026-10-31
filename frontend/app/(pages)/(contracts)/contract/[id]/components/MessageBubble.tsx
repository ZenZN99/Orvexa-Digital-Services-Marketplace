"use client";

import { IMessage } from "@/app/types/message";
import Avatar from "./Avatar";
import { formatTime } from "../utils/helpers";
import { CheckCheck, Trash2 } from "lucide-react";

interface MessageBubbleProps {
  message: IMessage;
  isMine: boolean;
  canDelete: boolean;
  deleting: boolean;
  onDelete: (messageId: string) => void;
}

export default function MessageBubble({
  message,
  isMine,
  canDelete,
  deleting,
  onDelete,
}: MessageBubbleProps) {
  const sender = message.sender;
  const images = message.images ?? [];

  return (
    <div
      className={`group flex items-end gap-3 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!isMine && <Avatar user={sender} size="sm" />}

      <div
        className={`flex max-w-[82%] flex-col ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        <div className="mb-1 flex items-center gap-2 px-1">
          {!isMine && sender && (
            <span className="text-xs font-medium text-white/55">
              {sender.firstName} {sender.lastName}
            </span>
          )}
          <span className="text-[10px] text-white/20">
            {formatTime(message.createdAt)}
          </span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isMine
              ? "rounded-br-md bg-brand-green text-brand-navy"
              : "rounded-bl-md border border-white/8 bg-white/4.5 text-white/75"
          } ${deleting ? "opacity-40" : ""}`}
        >
          {message.content && (
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.content}
            </p>
          )}

          {images.length > 0 && (
            <div
              className={`grid gap-2 ${
                images.length > 1 ? "mt-3 grid-cols-2" : "mt-1 grid-cols-1"
              }`}
            >
              {images.map((image) => (
                <a
                  key={image.publicId}
                  href={image.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={image.url}
                    alt="Message attachment"
                    className="max-h-64 rounded-xl object-cover"
                  />
                </a>
              ))}
            </div>
          )}
        </div>

        {isMine && (
          <div className="mt-1 flex flex-row-reverse items-center gap-2 px-1 opacity-0 transition group-hover:opacity-100">
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(message.id)}
                disabled={deleting}
                className="inline-flex items-center gap-1 text-[10px] text-red-400/50 transition hover:text-red-400 disabled:opacity-40"
              >
                <Trash2 size={11} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}

            <span className="inline-flex items-center text-brand-green/50">
              <CheckCheck size={12} />
            </span>
          </div>
        )}
      </div>

      {isMine && <Avatar user={sender} size="sm" />}
    </div>
  );
}
