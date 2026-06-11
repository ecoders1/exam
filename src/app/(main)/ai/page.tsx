import type { Metadata } from "next";
import AIAssistant from "@/components/ai/AIAssistant";

export const metadata: Metadata = { title: "AI Study Assistant" };

export default function AIPage() {
  return (
    <div className="h-[calc(100vh-8rem)] px-4 py-4">
      <AIAssistant />
    </div>
  );
}
