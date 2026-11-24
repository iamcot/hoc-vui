import { notFound } from "next/navigation";
import { SUBJECTS, allLessons, getLesson } from "@/content/subjects";
import { LessonPlayer } from "./LessonPlayer";
import { CodePractice } from "@/components/code/CodePractice";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).flatMap((s) => allLessons(s).map((l) => ({ subject: s.id, lesson: l.id })));
}

export default async function Page({ params }: { params: Promise<{ subject: string; lesson: string }> }) {
  const { subject, lesson } = await params;
  const info = getLesson(subject, lesson);
  if (!info) notFound();
  // môn Lập trình: hướng dẫn và màn chơi đi liền một luồng
  if (info.lesson.code) return <CodePractice subjectId={subject} lessonId={lesson} />;
  return <LessonPlayer subjectId={subject} lessonId={lesson} />;
}
