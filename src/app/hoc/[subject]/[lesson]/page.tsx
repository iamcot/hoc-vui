import { notFound } from "next/navigation";
import { SUBJECTS, allLessons, getLesson } from "@/content/subjects";
import { LessonPlayer } from "./LessonPlayer";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).flatMap((s) => allLessons(s).map((l) => ({ subject: s.id, lesson: l.id })));
}

export default async function Page({ params }: { params: Promise<{ subject: string; lesson: string }> }) {
  const { subject, lesson } = await params;
  if (!getLesson(subject, lesson)) notFound();
  return <LessonPlayer subjectId={subject} lessonId={lesson} />;
}
