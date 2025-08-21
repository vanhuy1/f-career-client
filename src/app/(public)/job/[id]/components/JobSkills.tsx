import { Job } from '@/types/Job';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';

interface JobSkillsProps {
  job: Job;
}

export default function JobSkills({ job }: JobSkillsProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-20 translate-y-20 rounded-full bg-gradient-to-tr from-orange-100 to-yellow-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Required Skills</h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex flex-wrap gap-3">
          {job.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-orange-200 bg-orange-50 text-orange-700"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
    </div>
  );
}
