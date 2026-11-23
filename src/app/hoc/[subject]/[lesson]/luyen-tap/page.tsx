import { notFound } from "next/navigation";
import { SUBJECTS, allLessons, getLesson } from "@/content/subjects";
import { Practice } from "./Practice";
import { TypingPractice } from "@/components/typing/TypingPractice";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).flatMap((s) => allLessons(s).map((l) => ({ subject: s.id, lesson: l.id })));
}

export default async function Page({ params }: { params: Promise<{ subject: string; lesson: string }> }) {
  const { subject, lesson } = await params;
  const info = getLesson(subject, lesson);
  if (!info) notFound();
  if (info.lesson.typing) return <TypingPractice subjectId={subject} lessonId={lesson} />;
  return <Practice subjectId={subject} lessonId={lesson} />;
}
