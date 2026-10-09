"use client";

import { ServiceCategory } from "@/app/types/service";
import { categoryOptions } from "../utils/categoryOptions";
import { formatLabel } from "../utils/formatLabel";
import { ServiceForm } from "./LeftForm";



interface CategoryProps {
  form: ServiceForm;
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  errors: {
    category?: string;
  };
}

export default function Category({ form, setForm, errors }: CategoryProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <label className="mb-3 block text-sm font-medium text-white/80">
        Category
      </label>

      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((category) => {
          const active = form.category === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setForm((p) => ({ ...p, category }))}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-brand-green/40 bg-brand-green/15 text-brand-green"
                  : "border-white/[0.07] bg-white/2.5 text-white/50 hover:border-white/15 hover:text-white/80"
              }`}
            >
              {formatLabel(category)}
            </button>
          );
        })}
      </div>

      {errors.category && (
        <p className="mt-2 text-xs text-red-400">{errors.category}</p>
      )}
    </div>
  );
}
