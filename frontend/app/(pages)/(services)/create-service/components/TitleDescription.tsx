"use client";

import { ServiceForm } from "./LeftForm";

interface TitleDescriptionProps {
  form: ServiceForm;
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  errors: {
    title?: string;
    description?: string;
  };
  titleMinLength: number;
  titleMaxLength: number;
  descriptionMinLength: number;
  descriptionMaxLength: number;
}

export default function TitleDescription({
  form,
  setForm,
  errors,
  titleMinLength,
  titleMaxLength,
  descriptionMinLength,
  descriptionMaxLength,
}: TitleDescriptionProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          Service title (minimum 10 characters)
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          minLength={titleMinLength}
          maxLength={titleMaxLength}
          placeholder="e.g. Build a scalable NestJS backend API"
          className="w-full rounded-lg border border-white/7 bg-white/2.5 px-3 py-2.5 text-sm text-white outline-none"
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.title ? (
            <p className="text-xs text-red-400">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-white/30">
            {form.title.length}/{titleMaxLength}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          Description (minimum 50 characters)
        </label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={5}
          minLength={descriptionMinLength}
          maxLength={descriptionMaxLength}
          placeholder="Explain what's included, your process, and what makes your service stand out..."
          className="w-full resize-none rounded-lg border border-white/7 bg-white/2.5 px-3 py-2.5 text-sm text-white outline-none"
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description ? (
            <p className="text-xs text-red-400">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-white/30">
            {form.description.length}/{descriptionMaxLength} characters
          </span>
        </div>
      </div>
    </div>
  );
}
