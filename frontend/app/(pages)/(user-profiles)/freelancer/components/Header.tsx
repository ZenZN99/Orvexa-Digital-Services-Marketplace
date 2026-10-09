"use client";

import { IUser } from "@/app/types/user";
import Avatar from "./Avatar";
import Cover from "./Cover";
import Name from "./Name";
import Rating from "./Rating";
import QuickStats from "./QuickStats";
import EditControls from "./EditControls";
import JobTitleField, { EditForm } from "./JobTitleField";

interface HeaderProps {
  isEditing: boolean;
  user: IUser;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  saving: boolean;
  hasValidationError: boolean;
}

export default function Header({
  isEditing,
  user,
  handleEdit,
  handleCancel,
  handleSave,
  editForm,
  setEditForm,
  saving,
  hasValidationError,
}: HeaderProps) {
  return (
    <section className="overflow-hidden rounded-4xl border border-white/8 bg-white/2.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <Cover user={user} />

      <div className="relative flex flex-col items-center px-5 pb-8">
        <Avatar user={user} />

        <Name user={user} />

        <JobTitleField
          isEditing={isEditing}
          user={user}
          editForm={editForm}
          setEditForm={setEditForm}
        />

        <Rating user={user} />

        <QuickStats user={user} />

        <EditControls
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleSave={handleSave}
          saving={saving}
          hasValidationError={hasValidationError}
        />
      </div>
    </section>
  );
}
