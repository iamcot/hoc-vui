"use client";

/** bộ lọc dạng dropdown có nhãn, dùng chung (bảng xếp hạng...) */
export function Pick({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl bg-white/90 py-1 pl-4 pr-1 text-sm font-extrabold text-ink-soft shadow-[var(--shadow-pop)]">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-xl border-0 bg-transparent pr-2 font-display text-base font-extrabold text-ink outline-none">
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
