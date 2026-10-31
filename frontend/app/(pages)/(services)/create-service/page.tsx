"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "@/app/hooks/useServices";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { ServiceCategory } from "@/app/types/service";
import type { ServiceData } from "@/app/apis/services";
import Header from "./components/Header";
import LeftForm, { ServiceForm } from "./components/LeftForm";
import RightPreview from "./components/RightPreview";
import { validateService, VALIDATION } from "./utils/validate";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import IsSubmitted from "./components/IsSubmitted";

const emptyForm: ServiceForm = {
  category: ServiceCategory.PROGRAMMING,
  title: "",
  description: "",
  features: [],
  keywords: [],
  price: 0.0,
  deliveryDays: 0,
};

export default function CreateService() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { createService, loading } = useServices();

  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = useMemo(() => {
    const title = form.title.trim();
    const description = form.description.trim();

    return (
      form.category.trim() !== "" &&
      title.length >= VALIDATION.title.min &&
      title.length <= VALIDATION.title.max &&
      description.length >= VALIDATION.description.min &&
      description.length <= VALIDATION.description.max &&
      form.features.length >= VALIDATION.features.min &&
      form.features.length <= VALIDATION.features.max &&
      form.keywords.length >= VALIDATION.keywords.min &&
      form.keywords.length <= VALIDATION.keywords.max &&
      Number(form.price) >= VALIDATION.price.min &&
      Number.isInteger(Number(form.deliveryDays)) &&
      Number(form.deliveryDays) >= VALIDATION.deliveryDays.min &&
      Number(form.deliveryDays) <= VALIDATION.deliveryDays.max &&
      images.length <= VALIDATION.images.max
    );
  }, [form, images]);

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) return;

    if (form.features.length >= VALIDATION.features.max) {
      setErrors((p) => ({
        ...p,
        features: `You can add up to ${VALIDATION.features.max} features only`,
      }));
      return;
    }

    if (form.features.includes(value)) {
      setErrors((p) => ({ ...p, features: "This feature was already added" }));
      return;
    }

    setForm((p) => ({ ...p, features: [...p.features, value] }));
    setFeatureInput("");
    setErrors((p) => ({ ...p, features: "" }));
  };

  const removeFeature = (index: number) => {
    setForm((p) => ({
      ...p,
      features: p.features.filter((_, i) => i !== index),
    }));
  };

  const addKeyword = () => {
    const value = keywordInput.trim();
    if (!value) return;

    if (form.keywords.length >= VALIDATION.keywords.max) {
      setErrors((p) => ({
        ...p,
        keywords: `You can add up to ${VALIDATION.keywords.max} keywords only`,
      }));
      return;
    }

    if (form.keywords.includes(value)) {
      setErrors((p) => ({ ...p, keywords: "This keyword was already added" }));
      return;
    }

    setForm((p) => ({ ...p, keywords: [...p.keywords, value] }));
    setKeywordInput("");
    setErrors((p) => ({ ...p, keywords: "" }));
  };

  const removeKeyword = (index: number) => {
    setForm((p) => ({
      ...p,
      keywords: p.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = VALIDATION.images.max - images.length;

    if (remainingSlots <= 0) {
      setErrors((p) => ({
        ...p,
        images: `You can upload up to ${VALIDATION.images.max} images only`,
      }));
      event.target.value = "";
      return;
    }

    const accepted = files.slice(0, remainingSlots);
    const wasTrimmed = files.length > accepted.length;

    setImages((prev) => [...prev, ...accepted]);
    setImagePreviews((prev) => [
      ...prev,
      ...accepted.map((file) => URL.createObjectURL(file)),
    ]);

    setErrors((p) => ({
      ...p,
      images: wasTrimmed
        ? `Only ${remainingSlots} image(s) were added — the limit is ${VALIDATION.images.max}`
        : "",
    }));

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setErrors((p) => ({ ...p, images: "" }));
  };

  const validate = () => {
    const nextErrors = validateService({
      category: form.category,
      title: form.title,
      description: form.description,
      features: form.features,
      keywords: form.keywords,
      price: Number(form.price),
      deliveryDays: Number(form.deliveryDays),
      imagesCount: images.length,
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    const payload: ServiceData = {
      category: form.category as ServiceCategory,
      title: form.title.trim(),
      description: form.description.trim(),
      features: form.features,
      keywords: form.keywords,
      price: Number(form.price),
      deliveryDays: Number(form.deliveryDays),
    };

    const result = await createService(payload, images);

    if (result) {
      setIsSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <IsSubmitted handleResetForm={handleResetForm} router={router} />;
  }

  return (
    <ProtectedRoute roles={[UserRole.FREELANCER]}>
      <main className="pt-20 min-h-screen bg-brand-navy pb-24 text-white">
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
          <Header />

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"
          >
            {/* LEFT: form */}
            <LeftForm
              form={form}
              setForm={setForm}
              errors={errors}
              featureInput={featureInput}
              setFeatureInput={setFeatureInput}
              addFeature={addFeature}
              removeFeature={removeFeature}
              keywordInput={keywordInput}
              setKeywordInput={setKeywordInput}
              addKeyword={addKeyword}
              removeKeyword={removeKeyword}
              imagePreviews={imagePreviews}
              removeImage={removeImage}
              handleImagesChange={handleImagesChange}
              isValid={isValid}
              loading={loading}
              titleMinLength={VALIDATION.title.min}
              titleMaxLength={VALIDATION.title.max}
              descriptionMinLength={VALIDATION.description.min}
              descriptionMaxLength={VALIDATION.description.max}
              maxFeatures={VALIDATION.features.max}
              maxKeywords={VALIDATION.keywords.max}
              maxImages={VALIDATION.images.max}
              priceMin={VALIDATION.price.min}
              deliveryDaysMin={VALIDATION.deliveryDays.min}
              deliveryDaysMax={VALIDATION.deliveryDays.max}
            />

            {/* RIGHT: live preview */}
            <RightPreview
              imagePreviews={imagePreviews}
              form={form}
              currentUser={currentUser}
            />
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
