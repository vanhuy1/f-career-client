import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface JobProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    categories: string[];
    logo: string;
  };
}

export default function JobCard({ job }: JobProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 relative flex-shrink-0">
          <Image
            src={job.logo || "/placeholder.svg"}
            alt={`${job.company} logo`}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <span>{job.company}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-[#e6f7f1] text-[#10b981] border-[#e6f7f1] hover:bg-[#d1f1e6] hover:text-[#10b981]">
              {job.type}
            </Badge>

            {job.categories.map((category, index) => {
              // Marketing badges are orange
              if (category === "Marketing") {
                return (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-[#fff7e6] text-[#f59e0b] border-[#fff7e6] hover:bg-[#ffefcc] hover:text-[#f59e0b]">
                    {category}
                  </Badge>
                );
              }

              // Design badges are purple
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-[#eef2ff] text-[#6366f1] border-[#eef2ff] hover:bg-[#e0e7ff] hover:text-[#6366f1]">
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
