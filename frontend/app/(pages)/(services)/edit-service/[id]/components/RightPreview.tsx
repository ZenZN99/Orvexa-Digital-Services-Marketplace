"use client";

import { Clock, ImagePlus } from "lucide-react";
import { IUser } from "@/app/types/user";
import { ServiceForm } from "./LeftForm";
import { formatLabel } from "../../../create-service/utils/formatLabel";

interface RightPreviewProps {
  existingImages: { url: string }[];
  imagePreviews: string[];
  form: ServiceForm;
  currentUser: IUser | null;
}

export default function RightPreview({
  existingImages,
  imagePreviews,
  form,
  currentUser,
}: RightPreviewProps) {
  // New image wins, otherwise fall back to the current cover
  const cover = imagePreviews[0] ?? existingImages[0]?.url;

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/30">
        Preview
      </p>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-brand-navy/40 backdrop-blur-xl">
        <div className="flex h-40 items-center justify-center bg-white/3">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={28} className="text-white/15" />
          )}
        </div>

        <div className="space-y-3 p-4">
          {form.category && (
            <span className="inline-block rounded-md border border-brand-green/20 bg-brand-green/10 px-2 py-0.5 text-[10px] font-medium text-brand-green">
              {formatLabel(form.category)}
            </span>
          )}

          <h3 className="text-sm font-semibold text-white">
            {form.title || "Your service title"}
          </h3>

          <p className="line-clamp-3 text-xs leading-relaxed text-white/45">
            {form.description ||
              "Your description will appear here as you type."}
          </p>

          <div className="flex items-center justify-between border-t border-white/[0.07] pt-3">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Clock size={13} />
              {form.deliveryDays
                ? `${form.deliveryDays} day${
                    Number(form.deliveryDays) > 1 ? "s" : ""
                  } delivery`
                : "Delivery time"}
            </div>
            <span className="text-sm font-semibold text-brand-green">
              {form.price ? `$${form.price}` : "$0"}
            </span>
          </div>
        </div>
      </div>

      {currentUser && (
        <p className="mt-3 text-center text-xs text-white/30">
          Listed under {currentUser.firstName} {currentUser.lastName}
        </p>
      )}
    </div>
  );
}
