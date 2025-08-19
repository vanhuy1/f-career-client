'use client';

export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
        <p className="mt-4">Loading checklists...</p>
      </div>
    </div>
  );
}
