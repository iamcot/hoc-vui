/** Văn bản đơn giản: **đậm**, xuống dòng. */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-1.5 leading-relaxed ${className}`}>
      {text.split("\n").map((line, i) => (
        <p key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <b key={j} className="font-extrabold text-ink">
                {part.slice(2, -2)}
              </b>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
