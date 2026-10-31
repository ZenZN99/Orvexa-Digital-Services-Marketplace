"use client";

import { CheckCircle2 } from "lucide-react";
import { formatDateTime, userLabel } from "../utils/helpers";
import { ISupportConversation } from "@/app/types/support-conversation";

interface ClosedInfoProps {
  isOpen: boolean;
  conversation: ISupportConversation;
}

export default function ClosedInfo({ isOpen, conversation }: ClosedInfoProps) {
  return (
    <div>
      {!isOpen ? (
        <div className="border-t border-white/6 px-5 py-5">
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-white/35" />

              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35">
                Closure Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] text-white/25">Closed At</p>

                <p className="mt-1 text-sm text-white/55">
                  {formatDateTime(conversation.closedAt)}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-white/25">Closed By</p>

                <p className="mt-1 text-sm text-white/55">
                  {userLabel(conversation.closedByUser, conversation.closedBy)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
