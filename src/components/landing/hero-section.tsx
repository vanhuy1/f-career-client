import HeroSearchForm from '@/components/common/HeroSearchForm';

export function HeroSection() {
  return (
    <div className="bg-[#f8f8fd] text-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Text */}
        <div className="max-w-3xl">
          <h1 className="mb-2 text-5xl font-bold text-gray-800 md:text-6xl">
            Discover
            <br />
            more than
            <br />
            <span className="text-[#0a9de7]">5000+ Jobs</span>
          </h1>

          {/* Blue Underline */}
          <div className="relative mb-6 h-[30px] w-[300px]">
            <div className="absolute top-0 left-0 w-full">
              <svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 18C35.6667 6 138.8 -9.6 298 18"
                  stroke="#0a9de7"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="mb-8 max-w-lg text-gray-600">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>

          {/* Enhanced Search Form */}
          <HeroSearchForm />

          {/* Popular Searches */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="mr-2">Popular :</span>
            <span className="text-gray-700">
              UI Designer, UX Researcher, Android, Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
