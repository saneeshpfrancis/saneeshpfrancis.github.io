import { cn } from "@/utils/cn";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      <div
        className={cn(
          "mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
