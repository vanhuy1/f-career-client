'use client';

import { StepProps } from '@/types/Job';
import RichTextEditor from './RichTextEditor';
import { useEffect, useState } from 'react';

export default function Step2(_props: StepProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [whoYouAre, setWhoYouAre] = useState('');
  const [niceToHaves, setNiceToHaves] = useState('');

  useEffect(() => {
    // Update the state with the props values when they change
  }, [_props]);
  return (
    <div className="w-full">
      <h2 className="mb-1 text-lg font-medium">Details</h2>
      <p className="mb-4 text-sm text-gray-500">
        Add the description of the job, responsibilities, who you are, and
        nice-to-haves.
      </p>

      <div className="space-y-8 divide-y divide-gray-100">
        {/* Job Description */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Job Description</h3>
            <p className="mt-1 text-sm text-gray-500">
              Describe the role in detail
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <RichTextEditor
              content={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* Responsibilities */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Responsibilities</h3>
            <p className="mt-1 text-sm text-gray-500">List the main duties</p>
          </div>
          <div className="w-full md:col-span-2">
            <RichTextEditor
              content={responsibilities}
              onChange={setResponsibilities}
            />
          </div>
        </div>

        {/* Who You Are */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Who You Are</h3>
            <p className="mt-1 text-sm text-gray-500">
              Describe the ideal candidate
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <RichTextEditor content={whoYouAre} onChange={setWhoYouAre} />
          </div>
        </div>

        {/* Nice-To-Haves */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Nice-To-Haves</h3>
            <p className="mt-1 text-sm text-gray-500">
              Optional but useful skills
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <RichTextEditor content={niceToHaves} onChange={setNiceToHaves} />
          </div>
        </div>
      </div>
    </div>
  );
}
