interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
