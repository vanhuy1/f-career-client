import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function JobBoard() {
  const jobs = [
    {
      id: 1,
      title: "Email Marketing",
      company: "Revolut",
      location: "Madrid, Spain",
      description: "Revolut is looking for Email Marketing to help team ma...",
      tags: ["Marketing", "Design"],
      logo: "/revolut-logo.svg",
    },
    {
      id: 2,
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Fransisco, US",
      description:
        "Dropbox is looking for Brand Designer to help the team t...",
      tags: ["Design", "Business"],
      logo: "/dropbox-logo.svg",
    },
    {
      id: 3,
      title: "Email Marketing",
      company: "Pitch",
      location: "Berlin, Germany",
      description:
        "Pitch is looking for Customer Manager to join marketing t...",
      tags: ["Marketing"],
      logo: "/pitch-logo.svg",
    },
    {
      id: 4,
      title: "Visual Designer",
      company: "Blinkist",
      location: "Granada, Spain",
      description:
        "Blinkist is looking for Visual Designer to help team desi...",
      tags: ["Design"],
      logo: "/blinkist-logo.svg",
    },
    {
      id: 5,
      title: "Product Designer",
      company: "ClassPass",
      location: "Manchester, UK",
      description: "ClassPass is looking for Product Designer to help us...",
      tags: ["Marketing", "Design"],
      logo: "/classpass-logo.svg",
    },
    {
      id: 6,
      title: "Lead Designer",
      company: "Canva",
      location: "Ontario, Canada",
      description: "Canva is looking for Lead Engineer to help develop n...",
      tags: ["Design", "Business"],
      logo: "/canva-logo.svg",
    },
    {
      id: 7,
      title: "Brand Strategist",
      company: "GoDaddy",
      location: "Marseille, France",
      description:
        "GoDaddy is looking for Brand Strategist to join the team...",
      tags: ["Marketing"],
      logo: "/godaddy-logo.svg",
    },
    {
      id: 8,
      title: "Data Analyst",
      company: "Twitter",
      location: "San Diego, US",
      description: "Twitter is looking for Data Analyst to help team desi...",
      tags: ["Technology"],
      logo: "/twitter-logo.svg",
    },
  ];

  return (
    <div className="bg-[#1A1B26] py-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured<span className="text-[#3B82F6]">jobs</span>
          </h2>
          <a
            href="#"
            className="text-[#3B82F6] flex items-center text-sm md:text-base hover:underline">
            Show all jobs <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <div>
      <div className="bg-white rounded-lg p-6 flex flex-col h-full ">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 relative">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs border border-gray-300 rounded px-2 py-1">
            Full Time
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
        <div className="text-sm text-gray-600 mb-2">
          {job.company} · {job.location}
        </div>

        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {job.tags.map((tag: any) => (
            <span
              key={tag}
              className={`text-xs px-3 py-1 rounded-full ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTagColor(tag: any) {
  switch (tag) {
    case "Marketing":
      return "bg-amber-100 text-amber-800";
    case "Design":
      return "bg-emerald-100 text-emerald-800";
    case "Business":
      return "bg-blue-100 text-blue-800";
    case "Technology":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
