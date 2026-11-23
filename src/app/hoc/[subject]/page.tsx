import { notFound } from "next/navigation";
import { SUBJECTS, getSubject } from "@/content/subjects";
import { SubjectMap } from "./SubjectMap";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).map((s) => ({ subject: s.id }));
}

export default async function Page({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const s = getSubject(subject);
  if (!s || !s.ready) notFound();
  return <SubjectMap subjectId={s.id} />;
}
