import type { Metadata } from "next";
import ResultsDashboard from "@/components/results/ResultsDashboard";

export const metadata: Metadata = { title: "Results & Analytics" };

export default function ResultsPage() {
  return <ResultsDashboard />;
}
