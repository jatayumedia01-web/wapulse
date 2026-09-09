type SectionHeadingProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {label && <p className="section-label">{label}</p>}
      <h2
        className={`mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-gray-text"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
