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
} from "lucide-react";
import Link from "next/link";

export default function JobCategories() {
  const categories = [
    {
      name: "Design",
      icon: <Wrench className="w-6 h-6 text-blue-600" />,
      jobs: 235,
      href: "#",
      active: false,
    },
    {
      name: "Sales",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      jobs: 756,
      href: "#",
      active: false,
    },
    {
      name: "Marketing",
      icon: <Megaphone className="w-6 h-6 text-white" />,
      jobs: 140,
      href: "#",
      active: true,
    },
    {
      name: "Finance",
      icon: <Wallet className="w-6 h-6 text-blue-600" />,
      jobs: 325,
      href: "#",
      active: false,
    },
    {
      name: "Technology",
      icon: <Computer className="w-6 h-6 text-blue-600" />,
      jobs: 436,
      href: "#",
      active: false,
    },
    {
      name: "Engineering",
      icon: <Code className="w-6 h-6 text-blue-600" />,
      jobs: 542,
      href: "#",
      active: false,
    },
    {
      name: "Business",
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      jobs: 211,
      href: "#",
      active: false,
    },
    {
      name: "Human Resource",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      jobs: 346,
      href: "#",
      active: false,
    },
  ];

  return (
    <div className="bg-[#1a1d26] py-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">
            Explore by <span className="text-blue-500">category</span>
          </h2>
          <Link
            href="#"
            className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2 group">
            Show all jobs
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`block p-6 rounded-lg transition-transform hover:scale-[1.02] ${
                category.active ? "bg-indigo-600" : "bg-white"
              }`}>
              <div className="mb-4">{category.icon}</div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  category.active ? "text-white" : "text-gray-900"
                }`}>
                {category.name}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`${
                    category.active ? "text-indigo-200" : "text-gray-500"
                  }`}>
                  {category.jobs} jobs available
                </span>
                <ArrowRight
                  className={`w-4 h-4 ${
                    category.active ? "text-white" : "text-gray-500"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
