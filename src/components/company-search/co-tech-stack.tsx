import { companyData } from '@/data/Company';
import Image from 'next/image';
import Link from 'next/link';

interface CompanyTechStackProps {
  company: (typeof companyData)[number];
}

export default function CompanyTechStack({ company }: CompanyTechStackProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Tech stack</h2>
      <p className="mb-6 text-gray-600">
        Learn about the technology and tools that {company.name} uses.
      </p>
      {company.techStack && company.techStack.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {company.techStack.map((tech, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                  {tech.logo ? (
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-200"></div>
                  )}
                </div>
              </div>
              <span className="mt-2 text-center text-sm">{tech.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No tech stack information available.
        </p>
      )}
      {company.techStack && company.techStack.length > 0 && (
        <div className="mt-6">
          <Link
            href="#"
            className="flex items-center text-indigo-600 hover:underline"
          >
            View tech stack <span className="ml-2">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
