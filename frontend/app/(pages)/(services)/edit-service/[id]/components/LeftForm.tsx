"use client";

import React from "react";
import Category from "./Category";
import { ServiceCategory } from "@/app/types/service";
import TitleDescription from "./TitleDescription";
import Features from "./Features";
import Keywords from "./Keywords";
import PriceDelivery from "./PriceDelivery";
import Button from "./Button";
import Images from "./images";

export interface ServiceForm {
  category: ServiceCategory;
  title: string;
  description: string;
  features: string[];
  keywords: string[];
  price: number;
  deliveryDays: number;
}

interface LeftFormProps {
  form: ServiceForm;
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  featureInput: string;
  setFeatureInput: React.Dispatch<React.SetStateAction<string>>;
  keywordInput: string;
  setKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  existingImages: { url: string }[];
  imagePreviews: string[];
  isValid: boolean;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  addKeyword: () => void;
  removeKeyword: (index: number) => void;
  removeImage: (index: number) => void;
  handleImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: {
    updating: boolean;
  };
  errors: {
    category?: string;
    title?: string;
    description?: string;
    features?: string;
    keywords?: string;
    price?: string;
    deliveryDays?: string;
    images?: string;
  };
  // Limits mirrored from the backend's DTO
  titleMinLength: number;
  titleMaxLength: number;
  descriptionMinLength: number;
  descriptionMaxLength: number;
  maxFeatures: number;
  maxKeywords: number;
  maxImages: number;
  priceMin: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
}

export default function LeftForm({
  form,
  setForm,
  errors,
  featureInput,
  setFeatureInput,
  addFeature,
  removeFeature,
  keywordInput,
  setKeywordInput,
  addKeyword,
  removeKeyword,
  existingImages,
  imagePreviews,
  removeImage,
  handleImagesChange,
  isValid,
  loading,
  titleMinLength,
  titleMaxLength,
  descriptionMinLength,
  descriptionMaxLength,
  maxFeatures,
  maxKeywords,
  maxImages,
  priceMin,
  deliveryDaysMin,
  deliveryDaysMax,
}: LeftFormProps) {
  return (
    <div className="space-y-5">
      <Category form={form} setForm={setForm} errors={errors} />

      <TitleDescription
        form={form}
        setForm={setForm}
        errors={errors}
        titleMinLength={titleMinLength}
        titleMaxLength={titleMaxLength}
        descriptionMinLength={descriptionMinLength}
        descriptionMaxLength={descriptionMaxLength}
      />

      <Features
        form={form}
        featureInput={featureInput}
        setFeatureInput={setFeatureInput}
        addFeature={addFeature}
        removeFeature={removeFeature}
        errors={errors}
        maxFeatures={maxFeatures}
      />

      <Keywords
        form={form}
        keywordInput={keywordInput}
        setKeywordInput={setKeywordInput}
        addKeyword={addKeyword}
        removeKeyword={removeKeyword}
        errors={errors}
        maxKeywords={maxKeywords}
      />

      <PriceDelivery
        form={form}
        setForm={setForm}
        errors={errors}
        priceMin={priceMin}
        deliveryDaysMin={deliveryDaysMin}
        deliveryDaysMax={deliveryDaysMax}
      />

      <Images
        existingImages={existingImages}
        imagePreviews={imagePreviews}
        removeImage={removeImage}
        handleImagesChange={handleImagesChange}
        maxImages={maxImages}
        errors={errors}
      />

      <Button isValid={isValid} loading={loading} />
    </div>
  );
}
