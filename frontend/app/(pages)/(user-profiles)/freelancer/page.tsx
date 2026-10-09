"use client";

import { JobTitle, Skills } from "@/app/types/freelancer";
import { useEffect, useState } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import ReviewsTab from "./components/ReviewsTab";
import OverviewTab from "./components/OverviewTab";
import ServicesTab from "./components/ServicesTab";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useFreelancers } from "@/app/hooks/useFreelancers";
import { EditForm } from "./components/JobTitleField";
import { useServices } from "@/app/hooks/useServices";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import { useReviews } from "@/app/hooks/useReviews";
import FreelancerProfileSkeleton from "./components/FreelancerProfileSkeleton";

export type Tab = "overview" | "services" | "reviews";

export default function FreelancerProfilePage() {
  const { currentUser } = useAuthStore();
  const { myFreelancer, loading, updateFreelancer } = useFreelancers();
  const { myServices, fetchMyServices, deleteService } = useServices();
  const { myReviews, fetchMyReviews } = useReviews();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);

  const [aboutError, setAboutError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  const [editForm, setEditForm] = useState({
    jobTitle: myFreelancer?.jobTitle ?? null,
    about: myFreelancer?.about ?? "",
    website: myFreelancer?.website ?? "",
    skills: myFreelancer?.skills ?? [],
  });

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  useEffect(() => {
    if (myFreelancer) {
      setEditForm({
        jobTitle: myFreelancer.jobTitle,
        about: myFreelancer.about,
        website: myFreelancer.website ?? "",
        skills: myFreelancer.skills,
      });
    }
  }, [myFreelancer]);

  const joinedDate = myFreelancer?.createdAt
    ? new Date(myFreelancer.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : undefined;

  const handleEdit = () => {
    if (!myFreelancer) return;

    setEditForm({
      jobTitle: myFreelancer.jobTitle,
      about: myFreelancer.about,
      website: myFreelancer.website ?? "",
      skills: myFreelancer.skills,
    });

    setAboutError("");
    setWebsiteError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (myFreelancer) {
      setEditForm({
        jobTitle: myFreelancer.jobTitle,
        about: myFreelancer.about,
        website: myFreelancer.website ?? "",
        skills: myFreelancer.skills,
      });
    }

    setAboutError("");
    setWebsiteError("");
    setIsEditing(false);
  };

  const handleAboutChange = (value: string) => {
    setEditForm((current) => ({
      ...current,
      about: value,
    }));

    if (value.length > 500) {
      setAboutError("About cannot exceed 500 characters.");
    } else {
      setAboutError("");
    }
  };

  const handleSave = async () => {
    if (editForm.about.length > 500) {
      setAboutError("About cannot exceed 500 characters.");
      return;
    }

    if (websiteError) {
      return;
    }

    setAboutError("");

    const updated = await updateFreelancer({
      jobTitle: editForm.jobTitle as JobTitle,
      about: editForm.about,
      website: editForm.website,
      skills: editForm.skills,
    });

    if (updated) {
      setIsEditing(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteService(serviceId);
    await fetchMyServices();
  };

  const toggleSkill = (skill: Skills) => {
    setEditForm((current) => {
      const exists = current.skills.includes(skill);

      return {
        ...current,
        skills: exists
          ? current.skills.filter((item) => item !== skill)
          : [...current.skills, skill],
      };
    });
  };

  if (loading.global || !currentUser || !myFreelancer) {
    return <FreelancerProfileSkeleton />;
  }

  const user = {
    ...currentUser,
    freelancer: myFreelancer,
  };

  const hasValidationError = !!aboutError || !!websiteError;

  return (
    <ProtectedRoute roles={[UserRole.FREELANCER]}>
      <main className="min-h-screen bg-brand-navy pb-24 text-white">
        <Background />

        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Header
            isEditing={isEditing}
            user={user}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
            editForm={editForm}
            setEditForm={setEditForm}
            saving={loading.updating}
            hasValidationError={hasValidationError}
          />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <OverviewTab
            activeTab={activeTab}
            isEditing={isEditing}
            user={user}
            editForm={editForm as EditForm}
            setEditForm={setEditForm}
            toggleSkill={toggleSkill}
            joinedDate={joinedDate}
            aboutError={aboutError}
            handleAboutChange={handleAboutChange}
            websiteError={websiteError}
            setWebsiteError={setWebsiteError}
          />

          <ServicesTab
            activeTab={activeTab}
            myServices={myServices}
            onDeleteService={handleDeleteService}
          />

          <ReviewsTab activeTab={activeTab} user={user} myReviews={myReviews} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
