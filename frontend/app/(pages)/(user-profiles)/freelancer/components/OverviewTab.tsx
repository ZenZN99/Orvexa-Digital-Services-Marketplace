"use client";

import { Dispatch, SetStateAction } from "react";
import About from "./About";
import SkillsField from "./SkillsField";
import Sidebar from "./Sidebar";

import type { IUser } from "@/app/types/user";
import { Tab } from "../page";
import { EditForm } from "./JobTitleField";
import { Skills } from "@/app/types/freelancer";

interface OverviewProps {
  activeTab: Tab;
  isEditing: boolean;
  user: IUser;
  editForm: EditForm;
  setEditForm: Dispatch<SetStateAction<EditForm>>;
  toggleSkill: (skill: Skills) => void;
  joinedDate?: string;

  // About validation
  aboutError: string;
  handleAboutChange: (value: string) => void;

  // Website validation
  websiteError: string;
  setWebsiteError: Dispatch<SetStateAction<string>>;
}

export default function OverviewTab({
  activeTab,
  isEditing,
  user,
  editForm,
  setEditForm,
  toggleSkill,
  joinedDate,
  aboutError,
  handleAboutChange,
  websiteError,
  setWebsiteError,
}: OverviewProps) {
  return (
    <div>
      {activeTab === "overview" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <About
              isEditing={isEditing}
              user={user}
              editForm={editForm}
              setEditForm={setEditForm}
              aboutError={aboutError}
              handleAboutChange={handleAboutChange}
            />

            <SkillsField
              isEditing={isEditing}
              user={user}
              editForm={editForm}
              toggleSkill={toggleSkill}
            />
          </section>

          <Sidebar
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            joinedDate={joinedDate}
            setEditForm={setEditForm}
            websiteError={websiteError}
            setWebsiteError={setWebsiteError}
          />
        </div>
      )}
    </div>
  );
}
