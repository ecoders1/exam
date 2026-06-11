import type { Metadata } from "next";
import QuizInterface from "@/components/quiz/QuizInterface";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage({ params }: { params: { subject: string } }) {
  return <QuizInterface subjectId={params.subject} />;
}
