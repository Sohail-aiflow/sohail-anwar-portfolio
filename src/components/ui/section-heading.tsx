interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  descriptionClassName?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  descriptionClassName = "",
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {description && (
        <p className={`section-description ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}
