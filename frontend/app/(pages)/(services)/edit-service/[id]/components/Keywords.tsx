"use client";

import { Plus, Tag, X } from "lucide-react";
import { ServiceForm } from "./LeftForm";

interface KeywordsProps {
  form: ServiceForm;
  keywordInput: string;
  setKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  addKeyword: () => void;
  removeKeyword: (index: number) => void;
  maxKeywords: number;
  errors: {
    keywords?: string;
  };
}

export default function Keywords({
  form,
  keywordInput,
  setKeywordInput,
  addKeyword,
  removeKeyword,
  maxKeywords,
  errors,
}: KeywordsProps) {
  const reachedLimit = form.keywords.length >= maxKeywords;

  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        Search keywords
      </label>
      <p className="mb-3 text-xs text-white/40">
        Helps clients find this service when searching. Up to {maxKeywords}{" "}
        keywords.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addKeyword();
              }
            }}
            disabled={reachedLimit}
            placeholder="e.g. nestjs"
            className="w-full rounded-lg border border-white/[0.07] bg-white/2.5 py-2.5 pl-9 pr-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={addKeyword}
          disabled={reachedLimit}
          className="flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 text-sm font-medium text-brand-green transition hover:bg-brand-green/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-green/10"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {errors.keywords && (
        <p className="mt-1.5 text-xs text-red-400">{errors.keywords}</p>
      )}

      {form.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {form.keywords.map((keyword, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/5 px-2.5 py-1 text-xs text-white/60"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-white/30 transition hover:text-red-400"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
