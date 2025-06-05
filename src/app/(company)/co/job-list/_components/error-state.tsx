'use client';

interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-red-50 p-6 text-red-600">
        Error: {error}
      </div>
    </div>
  );
}
