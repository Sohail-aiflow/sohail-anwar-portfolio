import { Network, Route, BookOpen, Braces } from "lucide-react";

const artwork = {
  "marketlink-team": { Icon: Network, theme: "blue" },
  "car-rental-system": { Icon: Route, theme: "peach" },
  "school-website-cms": { Icon: BookOpen, theme: "sage" },
  "marketlink-solo": { Icon: Braces, theme: "lavender" },
} as const;

export function ProjectArtwork({
  projectId,
  className = "",
}: {
  projectId: string;
  className?: string;
}) {
  const composition = artwork[projectId as keyof typeof artwork];
  const Icon = composition?.Icon ?? Braces;
  return (
    <figure
      className={`project-art art-${composition?.theme ?? "sage"} ${className}`}
    >
      <div className="art-orbit orbit-one" aria-hidden="true" />
      <div className="art-orbit orbit-two" aria-hidden="true" />
      <div className="art-object" aria-hidden="true">
        <Icon size={76} strokeWidth={1} />
      </div>
      <figcaption>
        <span>Abstract concept</span>
      </figcaption>
    </figure>
  );
}
