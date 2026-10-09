"use client";

import { FileCheck2, UserRound } from "lucide-react";
import UploadCard from "./UploadCard";
import { RefObject } from "react";
import { UploadedImage } from "../page";

interface UploadCardsProps {
  faceImage: UploadedImage | null;
  identityImage: UploadedImage | null;
  faceInputRef: RefObject<HTMLInputElement | null>;
  identityInputRef: RefObject<HTMLInputElement | null>;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "face" | "identity",
  ) => void;
  removeImage: (type: "face" | "identity") => void;
  loading: {
    creating?: boolean;
  };
}

export default function UploadCards({
  faceImage,
  identityImage,
  faceInputRef,
  identityInputRef,
  removeImage,
  handleImageUpload,
  loading,
}: UploadCardsProps) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <UploadCard
        title="Face photo"
        description="Upload a clear photo of your face."
        icon={<UserRound size={22} />}
        image={faceImage}
        inputRef={faceInputRef}
        disabled={loading.creating}
        onUpload={(event) => handleImageUpload(event, "face")}
        onRemove={() => removeImage("face")}
      />

      <UploadCard
        title="Identity document"
        description="Upload a photo of your ID while holding it in your hand."
        icon={<FileCheck2 size={22} />}
        image={identityImage}
        inputRef={identityInputRef}
        disabled={loading.creating}
        onUpload={(event) => handleImageUpload(event, "identity")}
        onRemove={() => removeImage("identity")}
      />
    </div>
  );
}
