export function BackgroundDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
      <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
      <div className="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
    </div>
  );
}
