"use client";

import { createPortal } from "react-dom";
import { IContract } from "@/app/types/contract";
import Header from "./components/Header";
import Participants from "./components/Participants";
import Service from "./components/Service";
import Information from "./components/Information";
import Dates from "./components/Dates";

interface ContractModalProps {
  contract: IContract;
  onClose: () => void;
}

export default function ContractModal({
  contract,
  onClose,
}: ContractModalProps) {
  const freelancer = contract.freelancer.user;
  const client = contract.client;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 bg-brand-navy shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Header onClose={onClose} />

        <div className="space-y-5 p-5">
          <Participants client={client} freelancer={freelancer} />

          <Service contract={contract} />

          <Information contract={contract} />

          <Dates contract={contract} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
