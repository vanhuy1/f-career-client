import { ArrowRight } from "lucide-react";
import JobCard from "./job-card";

// Job data structure
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  categories: string[];
  logo: string;
}

// Sample job data
const jobs: Job[] = [
  {
    id: 1,
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/nomad.svg",
  },
  {
    id: 2,
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/netlify.svg",
  },
  {
    id: 3,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, USA",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/dropbox.svg",
  },
  {
    id: 4,
    title: "Brand Designer",
    company: "Maze",
    location: "San Fransisco, USA",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/maze.svg",
  },
  {
    id: 5,
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/terraform.svg",
  },
  {
    id: 6,
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/udacity.svg",
  },
  {
    id: 7,
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/packer.svg",
  },
  {
    id: 8,
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logo: "/logos/webflow.svg",
  },
];

export default function JobBoardS() {
  return (
    <main className="min-h-screen bg-[#1a1d25] text-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              Latest <span className="text-[#3b82f6]">jobs open</span>
            </h1>
            <a
              href="#"
              className="text-[#6366f1] hover:text-[#818cf8] flex items-center gap-2 transition-colors">
              Show all jobs <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
