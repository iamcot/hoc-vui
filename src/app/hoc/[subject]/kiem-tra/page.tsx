import { notFound } from "next/navigation";
import { SUBJECTS, getSubject } from "@/content/subjects";
import { LevelTest } from "./LevelTest";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).map((s) => ({ subject: s.id }));
}

export default async function Page({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const s = getSubject(subject);
  if (!s?.ready) notFound();
  return <LevelTest subjectId={s.id} />;
}
