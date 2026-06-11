import type { Metadata } from "next";
import UserProfile from "@/components/profile/UserProfile";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <UserProfile />;
}
