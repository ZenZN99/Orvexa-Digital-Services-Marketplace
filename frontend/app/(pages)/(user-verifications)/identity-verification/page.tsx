"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useUserVerifications } from "@/app/hooks/useUserVerifications";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { UserVerificationsStatus } from "@/app/types/user-verification";
import PendingStatus from "./components/PendingStatus";
import RejectedStatus from "./components/RejectedStatus";
import ApprovedStatus from "./components/ApprovedStatus";
import Header from "./components/Header";
import ImportantNotice from "./components/ImportantNotice";
import UploadCards from "./components/UploadCards";
import Requirements from "./components/Requirements";
import Privacy from "./components/Privacy";
import Submit from "./components/Submit";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";

export interface UploadedImage {
  file: File;
  preview: string;
}

export default function IdentityVerificationPage() {
  const faceInputRef = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);

  const { loading, createVerification, tryAgainVerification } =
    useUserVerifications();
  const { currentUser, loadUser } = useAuthStore();

  const [faceImage, setFaceImage] = useState<UploadedImage | null>(null);
  const [identityImage, setIdentityImage] = useState<UploadedImage | null>(
    null,
  );

  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    type: "face" | "identity",
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    const preview = URL.createObjectURL(file);

    const image = {
      file,
      preview,
    };

    if (type === "face") {
      setFaceImage(image);
    } else {
      setIdentityImage(image);
    }

    event.target.value = "";
  };

  const removeImage = (type: "face" | "identity") => {
    if (type === "face") {
      if (faceImage) URL.revokeObjectURL(faceImage.preview);
      setFaceImage(null);
    } else {
      if (identityImage) URL.revokeObjectURL(identityImage.preview);
      setIdentityImage(null);
    }
  };

  const handleTryAgain = async () => {
    const result = await tryAgainVerification();

    if (result) {
      await loadUser();
    }
  };

  const canSubmit = faceImage && identityImage && !loading.creating;

  const handleSubmit = async () => {
    if (!faceImage || !identityImage || loading.creating) return;

    const result = await createVerification(faceImage.file, identityImage.file);

    if (result) {
      setSubmitted(true);
    }
  };

  const verificationStatus = currentUser?.verification?.status;

  if (!submitted && verificationStatus === UserVerificationsStatus.PENDING) {
    return <PendingStatus />;
  }

  if (!submitted && verificationStatus === UserVerificationsStatus.REJECTED) {
    return (
      <RejectedStatus
        currentUser={currentUser}
        tryingAgain={loading.tryingAgain}
        onTryAgain={handleTryAgain}
      />
    );
  }

  if (!submitted && verificationStatus === UserVerificationsStatus.APPROVED) {
    return <ApprovedStatus />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-navy pt-20 text-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
          <Header />

          <ImportantNotice />

          <UploadCards
            faceImage={faceImage}
            identityImage={identityImage}
            faceInputRef={faceInputRef}
            identityInputRef={identityInputRef}
            removeImage={removeImage}
            handleImageUpload={handleImageUpload}
            loading={loading}
          />

          <Requirements />

          <Privacy />

          <Submit
            submitted={submitted}
            canSubmit={canSubmit}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
