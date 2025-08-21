'use client';

import { Button } from '@/components/ui/button';
import { CompanyInfo } from '@/types/Job';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, DollarSign, Eye, Star } from 'lucide-react';
import { employmentType } from '@/enums/employmentType';

interface JobCardProps {
  id?: string;
  title: string;
  company: CompanyInfo;
  location: string;
  typeOfEmployment: string;
  category: { id: string; name: string };
  salary?: string;
  priorityPosition: number;
}

// Map the incoming string to the enum value
function getEmploymentTypeLabel(type: string): string {
  const normalized = type.replace(/[\s_-]/g, '').toLowerCase();

  // Check both keys and values of the enum
  for (const key of Object.keys(employmentType) as Array<
    keyof typeof employmentType
  >) {
    const enumValue = employmentType[key];
    if (
      key.replace(/[\s_-]/g, '').toLowerCase() === normalized ||
      enumValue.replace(/[\s_-]/g, '').toLowerCase() === normalized
    ) {
      return enumValue;
    }
  }
  // fallback to original string if not found
  return type;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  typeOfEmployment,
  category,
  salary,
  priorityPosition,
}: JobCardProps) {
  const router = useRouter();

  // Map typeOfEmployment to badge style
  const getTypeBadge = (t: string) => {
    // You can still style based on the normalized type if you want
    const normalized = t.replace(/[\s_-]/g, '').toLowerCase();
    switch (normalized) {
      case 'fulltime':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'parttime':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'contract':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Map category.name to badge style
  const getCategoryBadge = () => {
    switch (category.name) {
      case 'Technology':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Management':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Design':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Data Science':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Marketing':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get styles based on priorityPosition
  const getPositionStyles = () => {
    switch (priorityPosition) {
      case 1: // VIP
        return {
          card: 'border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-2xl ring-2 ring-purple-200 ring-opacity-50',
          badge:
            'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white animate-pulse shadow-lg',
          title: 'text-purple-800 font-bold',
          border:
            'border-gradient-to-r from-purple-400 via-pink-500 to-orange-400 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_25px_rgba(168,85,247,0.6)] after:animate-pulse',
        };
      case 2: // Premium
        return {
          card: 'border-2 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl ring-1 ring-blue-200',
          badge:
            'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md',
          title: 'text-blue-800 font-semibold',
          border: 'border-gradient-to-r from-blue-400 to-cyan-500 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
      case 3: // Basic
        return {
          card: 'border bg-gradient-to-br from-gray-50 to-gray-50/80 shadow-sm',
          badge: 'bg-gradient-to-r from-gray-600 to-gray-600 text-white',
          title: 'text-gray-800 font-medium',
          border: 'border-gray-300',
          effect: '',
        };
      default:
        return {
          card: 'border bg-white hover:shadow-md transition-all duration-200',
          badge: '',
          title: 'text-gray-800',
          border: '',
          effect: '',
        };
    }
  };

  const styles = getPositionStyles();

  // Position badge component
  const PositionBadge = () => {
    if (priorityPosition === 1) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 text-xs text-white shadow-lg"
        >
          <Trophy className="h-3 w-3" />
          <span className="font-bold">VIP</span>
        </Badge>
      );
    }
    if (priorityPosition === 2) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 text-xs text-white shadow-md"
        >
          <Star className="h-3 w-3" /> PREMIUM
        </Badge>
      );
    }
    return null;
  };

  const handleCardClick = () => {
    if (id) {
      router.push(`/job/${id}`);
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      router.push(`/job/${id}`);
    }
  };

  return (
    <div className="group w-full">
      <div
        className={`w-full cursor-pointer overflow-hidden rounded-lg ${styles.card} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
        onClick={handleCardClick}
      >
        <div className="relative w-full">
          {priorityPosition <= 2 && (
            <div className="absolute top-0 left-0">
              {priorityPosition === 1 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs font-bold`}
                >
                  🔥 HOT
                </Badge>
              ) : priorityPosition === 2 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs`}
                >
                  ⭐ TOP
                </Badge>
              ) : null}
            </div>
          )}

          <div className="flex p-3">
            <div className="mr-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={company.logoUrl || '/placeholder.svg'}
                  alt={`${company.companyName} logo`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm font-semibold ${styles.title} truncate`}
                  title={title}
                >
                  {title}
                </h3>
                <p className="truncate text-xs text-gray-600">
                  {company.companyName} • {location}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getTypeBadge(typeOfEmployment)}`}
                  >
                    {getEmploymentTypeLabel(typeOfEmployment)}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getCategoryBadge()}`}
                  >
                    {category.name}
                  </span>
                </div>
              </div>

              <div className="ml-3 flex flex-col items-end justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>2 days ago</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-green-600">
                  <DollarSign className="h-3 w-3" />
                  <span>{salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  {priorityPosition <= 2 && <PositionBadge />}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDetailClick}
                    className={`h-6 px-2 py-1 text-xs transition-all duration-200 hover:shadow-sm ${
                      priorityPosition === 1
                        ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                        : priorityPosition === 2
                          ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
