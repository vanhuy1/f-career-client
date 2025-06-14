import {
  ArrowRight,
  Code,
  Computer,
  Megaphone,
  Users,
  Briefcase,
  Clock,
  Wallet,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

export default function JobCategories() {
  const categories = [
    {
      name: 'Design',
      icon: <Wrench className="h-6 w-6 text-blue-600" />,
      jobs: 235,
      href: '#',
      active: false,
    },
    {
      name: 'Sales',
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      jobs: 756,
      href: '#',
      active: false,
    },
    {
      name: 'Marketing',
      icon: <Megaphone className="h-6 w-6 text-white" />,
      jobs: 140,
      href: '#',
      active: true,
    },
    {
      name: 'Finance',
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      jobs: 325,
      href: '#',
      active: false,
    },
    {
      name: 'Technology',
      icon: <Computer className="h-6 w-6 text-blue-600" />,
      jobs: 436,
      href: '#',
      active: false,
    },
    {
      name: 'Engineering',
      icon: <Code className="h-6 w-6 text-blue-600" />,
      jobs: 542,
      href: '#',
      active: false,
    },
    {
      name: 'Business',
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      jobs: 211,
      href: '#',
      active: false,
    },
    {
      name: 'Human Resource',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      jobs: 346,
      href: '#',
      active: false,
    },
  ];

  return (
    <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-800">
            Explore by <span className="text-blue-500">category</span>
          </h2>
          <Link
            href="#"
            className="group flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            Show all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`block rounded-lg border-1 p-6 transition-transform hover:scale-[1.02] ${
                category.active ? 'bg-blue-600' : 'bg-white'
              }`}
            >
              <div className="mb-4">{category.icon}</div>
              <h3
                className={`mb-2 text-xl font-bold ${category.active ? 'text-white' : 'text-gray-900'}`}
              >
                {category.name}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`${category.active ? 'text-blue-100' : 'text-gray-500'}`}
                >
                  {category.jobs} jobs available
                </span>
                <ArrowRight
                  className={`h-4 w-4 ${category.active ? 'text-white' : 'text-gray-500'}`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
