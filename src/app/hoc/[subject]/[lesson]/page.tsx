import { notFound } from "next/navigation";
import { SUBJECTS, allLessons, getLesson } from "@/content/subjects";
import { LessonPlayer } from "./LessonPlayer";
import { CodePractice } from "@/components/code/CodePractice";
import { ChemLesson } from "@/components/lab/ChemLesson";
import { BalanceLesson } from "@/components/lab/BalanceLesson";
import { LabNode } from "@/components/lab/LabNode";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).flatMap((s) => allLessons(s).map((l) => ({ subject: s.id, lesson: l.id })));
}

export default async function Page({ params }: { params: Promise<{ subject: string; lesson: string }> }) {
  const { subject, lesson } = await params;
  const info = getLesson(subject, lesson);
  if (!info) notFound();
  // môn Lập trình: hướng dẫn và màn chơi đi liền một luồng
  if (info.lesson.code) return <CodePractice subjectId={subject} lessonId={lesson} />;
  // môn Thí nghiệm hoá học: bàn thí nghiệm thay cho slide
  if (info.lesson.lab) return <ChemLesson subjectId={subject} lessonId={lesson} />;
  if (info.lesson.balance) return <BalanceLesson subjectId={subject} lessonId={lesson} />;
  if (info.subject.id === "hoa-hoc") return <LabNode subjectId={subject} lessonId={lesson} mode="hoc" />;
  return <LessonPlayer subjectId={subject} lessonId={lesson} />;
}
