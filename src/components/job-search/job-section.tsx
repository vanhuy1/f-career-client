interface JobSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function JobSection({ title, children }: JobSectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}
