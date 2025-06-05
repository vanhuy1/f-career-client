'use client';

export default function EmptyState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          No Company Found
        </h2>
        <p className="mt-2 text-gray-600">
          Please make sure you are logged in as a company user.
        </p>
      </div>
    </div>
  );
}
