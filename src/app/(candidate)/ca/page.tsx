import React from 'react';

const CandidateProfilePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <header className="w-full bg-blue-600 py-4 text-center text-white">
        <h1 className="text-2xl font-bold">Candidate Profile</h1>
      </header>
      <main className="mt-8 flex flex-col items-center px-4">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Welcome, Candidate!</h2>
          <p className="mb-6 text-gray-700">
            This is your profile landing page. Here you can manage your personal
            information, upload your resume, and explore job opportunities.
          </p>
          <div className="flex flex-col gap-4">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Edit Profile
            </button>
            <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
              Upload Resume
            </button>
            <button className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
              View Job Opportunities
            </button>
          </div>
        </div>
      </main>
      <footer className="mt-auto py-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} F-Connect. All rights reserved.
      </footer>
    </div>
  );
};

export default CandidateProfilePage;
