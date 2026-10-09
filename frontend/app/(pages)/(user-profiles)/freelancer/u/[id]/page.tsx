"use client";

import { useEffect, useState } from "react";
import Tabs from "../../components/Tabs";
import Background from "../../components/Background";
import Cover from "../../components/Cover";
import Avatar from "./components/Avatar";
import About from "./components/About";
import SkillsField from "./components/SkillsField";
import Sidebar from "./components/Sidebar";
import ServicesTab from "./components/ServicesTab";
import ReviewsTab from "./components/ReviewsTab";
import { useUsers } from "@/app/hooks/useUsers";
import { useFreelancers } from "@/app/hooks/useFreelancers";
import UserNotFound from "@/app/shared/components/UserNotFound";
import { useParams } from "next/navigation";
import { useServices } from "@/app/hooks/useServices";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { useReviews } from "@/app/hooks/useReviews";
import FreelancerProfileSkeleton from "../../components/FreelancerProfileSkeleton";

type Tab = "overview" | "services" | "reviews";

export default function FreelancerProfilePage() {
  const params = useParams();

  const userId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { user, fetchUserById } = useUsers();
  const { freelancerServices, fetchServicesByFreelancer } = useServices();
  const { freelancer, fetchFreelancerById } = useFreelancers();
  const { freelancerReviews, fetchReviewsByFreelancer } = useReviews();

  useEffect(() => {
    if (!userId) return;

    fetchUserById(userId);
    fetchFreelancerById(userId);
    fetchServicesByFreelancer(userId);
    fetchReviewsByFreelancer(userId);
  }, [
    userId,
    fetchUserById,
    fetchFreelancerById,
    fetchServicesByFreelancer,
    fetchReviewsByFreelancer,
  ]);

  const joinedDate = freelancer?.createdAt
    ? new Date(freelancer.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : undefined;

  if (!user || !freelancer) {
    return <FreelancerProfileSkeleton />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-navy pb-24 text-white">
        <Background />

        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-4xl border border-white/8 bg-white/2.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <Cover user={user} />

            <Avatar user={user} freelancer={freelancer} />
          </section>

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "overview" && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="space-y-6">
                <About user={user} freelancer={freelancer} />

                <SkillsField freelancer={freelancer} />
              </section>

              <Sidebar
                freelancer={freelancer}
                user={user}
                joinedDate={joinedDate}
              />
            </div>
          )}

          <ServicesTab
            activeTab={activeTab}
            user={user}
            freelancerServices={freelancerServices}
          />

          <ReviewsTab
            activeTab={activeTab}
            user={user}
            freelancer={freelancer}
            freelancerReviews={freelancerReviews}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
