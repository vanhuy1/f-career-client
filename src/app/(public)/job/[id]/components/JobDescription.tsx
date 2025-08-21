import { Job } from '@/types/Job';
import { createSafeHtml } from '@/utils/html-sanitizer';
import { Edit } from 'lucide-react';

interface JobDescriptionProps {
  job: Job;
}

export default function JobDescription({ job }: JobDescriptionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-slate-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg">
          <Edit className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
          <p className="mt-1 text-sm text-gray-600">
            Detailed information about the position
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="relative mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div
          className="prose prose-gray max-w-none text-base leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={createSafeHtml(job.description)}
        />
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  );
}
