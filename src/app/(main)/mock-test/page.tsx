import type { Metadata } from "next";
import MockTestHome from "@/components/mock-test/MockTestHome";

export const metadata: Metadata = { title: "Mock Test" };

export default function MockTestPage() {
  return <MockTestHome />;
}
