import type { Metadata } from "next";
import SubjectPractice from "@/components/practice/SubjectPractice";

export const metadata: Metadata = { title: "Practice Subject" };

export default function SubjectPracticePage({ params }: { params: { subject: string } }) {
  return <SubjectPractice subjectId={params.subject} />;
}
