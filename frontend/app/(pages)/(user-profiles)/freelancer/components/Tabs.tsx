"use client";

import React from "react";
import { Tab } from "../page";

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tabId: Tab) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="mt-6 flex justify-center">
      <div className="inline-flex rounded-2xl border border-white/8 bg-white/2.5 p-1.5 backdrop-blur-xl">
        {[
          { id: "overview" as Tab, label: "Overview" },
          { id: "services" as Tab, label: "Services" },
          { id: "reviews" as Tab, label: "Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-7 ${
              activeTab === tab.id
                ? "bg-brand-green text-white shadow-lg shadow-brand-green/10"
                : "text-white/45 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
