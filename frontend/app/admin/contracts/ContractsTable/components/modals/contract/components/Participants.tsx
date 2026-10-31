"use client";

import UserCard from "./UserCard";

interface ParticipantsProps {
  freelancer: {
    id: string;
    firstName?: string;
    lastName?: string;
    profile?: {
      avatar?: {
        url: string;
        publicId: string;
      } | null;
    } | null;
  };
  client: {
    id: string;
    firstName?: string;
    lastName?: string;
    profile?: {
      avatar?: {
        url: string;
        publicId: string;
      } | null;
    } | null;
  };
}

export default function Participants({
  freelancer,
  client,
}: ParticipantsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <UserCard
        label="Freelancer"
        id={freelancer.id}
        firstName={freelancer.firstName}
        lastName={freelancer.lastName}
        avatar={freelancer.profile?.avatar?.url}
      />

      <UserCard
        label="Client"
        id={client.id}
        firstName={client.firstName}
        lastName={client.lastName}
        avatar={client.profile?.avatar?.url}
      />
    </div>
  );
}