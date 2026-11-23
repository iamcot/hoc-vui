import { notFound } from "next/navigation";
import { SUBJECTS, getSubject, getTier } from "@/content/subjects";
import { TierTest } from "../../TierTest";

export function generateStaticParams() {
  return SUBJECTS.filter((s) => s.ready).flatMap((s) => s.tiers.filter((t) => t.units.length > 0).map((t) => ({ subject: s.id, tier: t.id })));
}

export default async function Page({ params }: { params: Promise<{ subject: string; tier: string }> }) {
  const { subject, tier } = await params;
  const s = getSubject(subject);
  const t = s && getTier(s, tier);
  if (!s?.ready || !t || t.units.length === 0) notFound();
  return <TierTest subjectId={s.id} tierId={t.id} mode="level" />;
}
