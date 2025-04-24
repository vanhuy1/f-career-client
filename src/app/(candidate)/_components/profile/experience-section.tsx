import Image from 'next/image';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Experience } from '@/types/UserProfile';

interface ExperienceSectionProps {
  experiences: Experience[];
  showMoreCount?: number;
}

export function ExperienceSection({
  experiences,
  showMoreCount = 0,
}: ExperienceSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Experiences</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {experiences.map((experience, index) => (
          <div
            key={experience.id}
            className={`${index < experiences.length - 1 ? 'mb-8 border-b pb-8' : 'mb-4'} relative`}
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
                  src={experience.logo || '/placeholder.svg'}
                  alt={experience.company}
                  width={32}
                  height={32}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{experience.role}</h3>
                <div className="mb-2 text-gray-500">
                  {experience.company} • {experience.employmentType} •{' '}
                  {experience.startDate} - {experience.endDate || 'Present'}
                  {!experience.endDate && ' (1y 1m)'}
                  {experience.endDate && ' (8y)'}
                </div>
                <div className="mb-3 text-gray-500">{experience.location}</div>
                <p className="text-gray-600">{experience.description}</p>
              </div>
            </div>
          </div>
        ))}

        {showMoreCount > 0 && (
          <button className="font-medium text-indigo-600">
            Show {showMoreCount} more experiences
          </button>
        )}
      </CardContent>
    </Card>
  );
}
