"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, UserRound, X } from "lucide-react";

import TableCell from "@/app/admin/components/TableCell";
import { IMessage } from "@/app/types/message";
import { UserRole } from "@/app/types/user";
import { formatMessageDate } from "../utils/helpers";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

export default function MessageRow({ message }: { message: IMessage }) {
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(message.sender.id);

  const images = message.images ?? [];

  const openImages = (index = 0) => {
    setCurrentImage(index);
    setShowImagesModal(true);
  };

  const closeImages = () => {
    setShowImagesModal(false);
    setCurrentImage(0);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <tr className="border-b border-white/5 last:border-0">
        <TableCell>
          <div className="flex items-center gap-2.5">
            <div className="group/avatar relative h-8 w-8 shrink-0">
              {message.sender.profile?.avatar?.url ? (
                <Link href={`/profile/u/${message.sender.id}`}>
                  <img
                    src={message.sender.profile.avatar.url}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover transition-all duration-200 hover:scale-125"
                  />
                </Link>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6">
                  <UserRound size={14} className="text-white/35" />
                </div>
              )}

              {isOnline && (
                <>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                    Online
                  </span>
                </>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-white/75">
                {message.sender.firstName} {message.sender.lastName}
              </p>

              <p className="mt-0.5 text-[11px] text-white/25">
                {message.sender.email}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              message.sender.role === UserRole.CLIENT
                ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                : "border-brand-green/20 bg-brand-green/10 text-brand-green"
            }`}
          >
            {message.sender.role === UserRole.CLIENT ? "Client" : "Freelancer"}
          </span>
        </TableCell>

        <TableCell>
          <p className="max-w-112.5 text-sm leading-6 text-white/60">
            {message.content || "Attachment only"}
          </p>
        </TableCell>

        <TableCell>
          {images.length > 0 ? (
            <button
              type="button"
              onClick={() => openImages()}
              className="group flex items-center gap-2"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/10">
                <img
                  src={images[0].url}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-110"
                />

                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="text-[10px] font-semibold text-white">
                      +{images.length - 1}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-xs text-white/40 transition group-hover:text-brand-green">
                {images.length} {images.length === 1 ? "image" : "images"}
              </span>
            </button>
          ) : (
            <span className="text-xs text-white/35">—</span>
          )}
        </TableCell>

        <TableCell>
          <span className="whitespace-nowrap text-xs text-white/35">
            {formatMessageDate(message.createdAt)}
          </span>
        </TableCell>
      </tr>

      {showImagesModal &&
        images.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={closeImages}
          >
            <div
              className="relative flex h-full w-full max-w-5xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeImages}
                className="absolute right-0 top-0 z-20 rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="relative flex h-[75vh] w-full items-center justify-center">
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-md transition hover:bg-black/70 hover:text-white sm:left-5"
                    >
                      <ChevronLeft size={22} />
                    </button>
                  )}

                  <img
                    src={images[currentImage].url}
                    alt=""
                    className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                  />

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-md transition hover:bg-black/70 hover:text-white sm:right-5"
                    >
                      <ChevronRight size={22} />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
                    {currentImage + 1} / {images.length}
                  </span>
                </div>

                {images.length > 1 && (
                  <div className="mt-4 flex max-w-full gap-2 overflow-x-auto px-2 pb-2">
                    {images.map((image, index) => (
                      <button
                        key={image.publicId}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          index === currentImage
                            ? "border-brand-green"
                            : "border-white/10 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
