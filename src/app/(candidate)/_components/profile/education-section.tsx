import Image from 'next/image';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Education } from '@/types/UserProfile';

interface EducationSectionProps {
  education: Education[];
  showMoreCount?: number;
}

export function EducationSection({
  education,
  showMoreCount = 0,
}: EducationSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Educations</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className={`${index < education.length - 1 ? 'mb-8 border-b pb-8' : 'mb-4'} relative`}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute top-0 right-0 h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <div className="flex gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                <Image
                  src={edu.logo || '/placeholder.svg'}
                  alt={edu.institution}
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                <div className="mb-2 text-gray-500">
                  {edu.degree}, {edu.field}
                </div>
                <div className="mb-3 text-gray-500">
                  {edu.startYear} - {edu.endYear}
                </div>
                {edu.description && (
                  <p className="text-gray-600">{edu.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {showMoreCount > 0 && (
          <button className="font-medium text-indigo-600">
            Show {showMoreCount} more educations
          </button>
        )}
      </CardContent>
    </Card>
  );
}
