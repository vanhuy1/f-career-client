interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className }: TagProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm ${className}`}>
      {children}
    </span>
  );
}
