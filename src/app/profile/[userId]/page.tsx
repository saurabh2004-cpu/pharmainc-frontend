import { getUserById, getUser, User, Institution } from "@/lib/api";
import { ProfilePageClient } from "./ProfilePageClient";
import { cookies } from "next/headers";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // We now delegate fetching to the client component to avoid Docker networking issues
  // and ensure cookies are sent correctly.
  return <ProfilePageClient userId={userId} />;
}
