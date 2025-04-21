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
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Good morning, Jake</h2>
          <p className="text-muted-foreground">
            Here is what&apos;s happening with your job search applications from
            July 19 - July 25.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border p-2">
          <span>Jul 19 - Jul 25</span>
          <Calendar className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Total Jobs Applied
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-5xl font-bold text-slate-800">45</span>
            <div className="h-16 w-16 text-slate-300">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Interviewed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-5xl font-bold text-slate-800">18</span>
            <div className="h-16 w-16 text-slate-300">
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

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Jobs Applied Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <StatusChart unsuitable={60} interviewed={40} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Upcoming Interviews
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 border-b pb-2">
            <h3 className="font-medium">Today, 26 November</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground w-24">10:00 AM</div>
              <div className="flex-1 border-l-4 border-transparent pl-4"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground w-24">10:30 AM</div>
              <div className="flex-1 rounded-r-md border-l-4 border-indigo-600 bg-indigo-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src="/logo-landing/nomad.png"
                      alt="Joe Bartmann"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Joe Bartmann</h4>
                    <p className="text-muted-foreground text-sm">
                      HR Manager at Divvy
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground w-24">11:00 AM</div>
              <div className="flex-1 border-l-4 border-transparent pl-4"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Recent Applications History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.CA.HOME.APPLICATIONLIST.path}
              className="inline-flex items-center font-medium text-indigo-600"
            >
              View all applications history
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-md">
          <Image
            src={logo || '/placeholder.svg'}
            alt={`${company} logo`}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{position}</h4>
          <div className="text-muted-foreground text-sm">
            {company} • {location} • {type}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-medium">Date Applied</div>
          <div className="text-muted-foreground text-sm">{date}</div>
        </div>
        <div className="w-28 text-right">
          <Badge
            variant="outline"
            className={`${statusColorMap[statusColor]} font-normal`}
          >
            {status}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
