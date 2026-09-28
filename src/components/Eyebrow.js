// src/components/Eyebrow.js
export default function Eyebrow({
  children,
  align = "center",
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-4 ${
        align === "left" ? "justify-start" : "justify-center"
      } ${className}`}
    >
      {align === "center" && <span className="h-px w-8 bg-wood/40" />}
      <span className="text-sm font-semibold tracking-[0.3em] text-wood uppercase">
        {children}
      </span>
      <span className="h-px w-8 bg-wood/40" />
    </div>
  );
}
