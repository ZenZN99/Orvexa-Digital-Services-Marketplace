"use client";

import { Plus, X } from "lucide-react";
import { ServiceForm } from "./LeftForm";

interface FeaturesProps {
  form: ServiceForm;
  featureInput: string;
  setFeatureInput: React.Dispatch<React.SetStateAction<string>>;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  maxFeatures: number;
  errors: {
    features?: string;
  };
}

export default function Features({
  form,
  featureInput,
  setFeatureInput,
  addFeature,
  removeFeature,
  errors,
  maxFeatures,
}: FeaturesProps) {
  const reachedLimit = form.features.length >= maxFeatures;

  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        What's included
      </label>
      <p className="mb-3 text-xs text-white/40">
        Add each thing a client gets with this service. Up to {maxFeatures}{" "}
        features.
      </p>

      <div className="flex gap-2">
        <input
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
          disabled={reachedLimit}
          placeholder="e.g. Source code and documentation"
          className="flex-1 rounded-lg border border-white/7 bg-white/2.5 px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addFeature}
          disabled={reachedLimit}
          className="flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 text-sm font-medium text-brand-green transition hover:bg-brand-green/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-green/10"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {form.features.length > 0 && (
        <ul className="mt-3 space-y-2">
          {form.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/2.5 px-3 py-2 text-sm text-white/70"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-white/30 transition hover:text-red-400"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors.features && (
        <p className="mt-2 text-xs text-red-400">{errors.features}</p>
      )}
    </div>
  );
}
