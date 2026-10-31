"use client";

import React from "react";
import { formatCurrency } from "../utils/helpers";
import { IContract } from "@/app/types/contract";

export default function TableFooter({ contracts }: { contracts: IContract[] }) {
  return (
    <div className="flex items-center justify-between border-t border-white/6 px-5 py-4">
      <span className="text-xs text-white/30">
        {contracts.length} {contracts.length === 1 ? "contract" : "contracts"}
      </span>

      <span className="text-xs text-white/30">
        Total value{" "}
        <span className="font-medium text-white/50">
          {formatCurrency(
            contracts.reduce((total, contract) => total + contract.amount, 0),
          )}
        </span>
      </span>
    </div>
  );
}
