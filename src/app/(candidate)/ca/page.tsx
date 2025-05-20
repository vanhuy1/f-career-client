import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusChart from '../_components/status-chart';
import ROUTES from '@/constants/navigation';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] origin-top scale-100 p-[2%]">
        <div className="mb-[2%] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-[calc(1.5rem+0.5vw)] font-semibold">
              Good morning, Jake
            </h2>
            <p className="text-muted-foreground text-[calc(0.875rem+0.2vw)]">
              Here is what&apos;s happening with your job search applications
              from July 19 - July 25.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-[1%] whitespace-nowrap">
            <span className="text-[calc(0.875rem+0.1vw)]">Jul 19 - Jul 25</span>
            <Calendar className="h-[calc(1.25rem+0.2vw)] w-[calc(1.25rem+0.2vw)] text-indigo-600" />
          </div>
        </div>

        <div className="mb-[3%] grid gap-[2%] md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-[2%]">
            <CardHeader className="pb-[1%]">
              <CardTitle className="text-[calc(1rem+0.2vw)] font-medium">
                Total Jobs Applied
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-[calc(2rem+1vw)] font-bold text-slate-800">
                45
              </span>
              <div className="h-[calc(4rem+1vw)] w-[calc(4rem+1vw)] text-slate-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="p-[2%]">
            <CardHeader className="pb-[1%]">
              <CardTitle className="text-[calc(1rem+0.2vw)] font-medium">
                Interviewed
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-[calc(2rem+1vw)] font-bold text-slate-800">
                18
              </span>
              <div className="h-[calc(4rem+1vw)] w-[calc(4rem+1vw)] text-slate-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="p-[2%] md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-[1%]">
              <CardTitle className="text-[calc(1rem+0.2vw)] font-medium">
                Jobs Applied Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="w-full max-w-[calc(15rem+5vw)]">
                <StatusChart unsuitable={60} interviewed={40} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-[3%] p-[2%]">
          <CardHeader className="pb-[1%]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[calc(1rem+0.2vw)] font-medium">
                Upcoming Interviews
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)]"
                >
                  <ChevronLeft className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)]"
                >
                  <ChevronRight className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)]" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-[2%] border-b pb-[1%]">
              <h3 className="text-[calc(0.875rem+0.2vw)] font-medium">
                Today, 26 November
              </h3>
            </div>
            <div className="space-y-[2%]">
              <div className="flex items-center gap-[2%]">
                <div className="text-muted-foreground w-[20%] max-w-[6rem] text-[calc(0.75rem+0.1vw)]">
                  10:00 AM
                </div>
                <div className="flex-1 border-l-4 border-transparent pl-[2%]"></div>
              </div>
              <div className="flex items-center gap-[2%]">
                <div className="text-muted-foreground w-[20%] max-w-[6rem] text-[calc(0.75rem+0.1vw)]">
                  10:30 AM
                </div>
                <div className="flex-1 rounded-r-md border-l-4 border-indigo-600 bg-indigo-50 p-[2%]">
                  <div className="flex items-center gap-[2%]">
                    <div className="relative h-[calc(2.5rem+0.5vw)] w-[calc(2.5rem+0.5vw)] overflow-hidden rounded-full">
                      <Image
                        src="/logo-landing/nomad.png"
                        alt="Joe Bartmann"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[calc(0.875rem+0.1vw)] font-medium">
                        Joe Bartmann
                      </h4>
                      <p className="text-muted-foreground text-[calc(0.75rem+0.1vw)]">
                        HR Manager at Divvy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[2%]">
                <div className="text-muted-foreground w-[20%] max-w-[6rem] text-[calc(0.75rem+0.1vw)]">
                  11:00 AM
                </div>
                <div className="flex-1 border-l-4 border-transparent pl-[2%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-[2%]">
          <CardHeader className="pb-[1%]">
            <CardTitle className="text-[calc(1rem+0.2vw)] font-medium">
              Recent Applications History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-[3%]">
              <ApplicationItem
                logo="/logo-landing/nomad.png"
                company="Nomad"
                location="Paris, France"
                position="Social Media Assistant"
                type="Full-Time"
                date="24 July 2021"
                status="In Review"
                statusColor="amber"
              />

              <ApplicationItem
                logo="/logo-landing/udacity.png"
                company="Udacity"
                location="New York, USA"
                position="Social Media Assistant"
                type="Full-Time"
                date="23 July 2021"
                status="Shortlisted"
                statusColor="indigo"
              />

              <ApplicationItem
                logo="/logo-landing/packer.avif"
                company="Packer"
                location="Madrid, Spain"
                position="Social Media Assistant"
                type="Full-Time"
                date="22 July 2021"
                status="Declined"
                statusColor="red"
              />
            </div>

            <div className="mt-[3%] text-center">
              <Link
                href={ROUTES.CA.HOME.APPLICATIONLIST.path}
                className="inline-flex items-center text-[calc(0.875rem+0.1vw)] font-medium text-indigo-600"
              >
                View all applications history
                <ChevronRight className="ml-1 h-[calc(1rem+0.1vw)] w-[calc(1rem+0.1vw)]" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface ApplicationItemProps {
  logo: string;
  company: string;
  location: string;
  position: string;
  type: string;
  date: string;
  status: string;
  statusColor: 'amber' | 'indigo' | 'red';
}

function ApplicationItem({
  logo,
  company,
  location,
  position,
  type,
  date,
  status,
  statusColor,
}: ApplicationItemProps) {
  const statusColorMap = {
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="flex flex-col justify-between gap-[2%] sm:flex-row sm:items-center">
      <div className="flex items-center gap-[2%]">
        <div className="relative h-[calc(3rem+0.5vw)] w-[calc(3rem+0.5vw)] overflow-hidden rounded-md">
          <Image
            src={logo || '/placeholder.svg'}
            alt={`${company} logo`}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-[calc(0.875rem+0.1vw)] font-medium">
            {position}
          </h4>
          <div className="text-muted-foreground text-[calc(0.75rem+0.1vw)]">
            {company} • {location} • {type}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-[2%] sm:mt-0">
        <div className="text-right">
          <div className="text-[calc(0.75rem+0.1vw)] font-medium">
            Date Applied
          </div>
          <div className="text-muted-foreground text-[calc(0.75rem+0.1vw)]">
            {date}
          </div>
        </div>
        <div className="w-[calc(7rem+1vw)] text-right">
          <Badge
            variant="outline"
            className={`${statusColorMap[statusColor]} text-[calc(0.75rem+0.05vw)] font-normal`}
          >
            {status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)]"
        >
          <MoreVertical className="h-[calc(1rem+0.1vw)] w-[calc(1rem+0.1vw)]" />
        </Button>
      </div>
    </div>
  );
}
