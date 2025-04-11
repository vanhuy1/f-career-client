import { Button } from "@/components/ui/button";

export default function JobPostingHero() {
  return (
    <div className="w-full bg-[#4F46E5] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Start posting jobs today
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Start posting jobs for only $10.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-[#4F46E5] hover:bg-gray-100 font-medium px-6">
            Sign Up For Free
          </Button>
        </div>
      </div>
      {/* Angled edge */}
      <div
        className="absolute top-0 right-0 h-full w-1/4 bg-[#1a1a2e] transform translate-x-1/2 skew-x-[-12deg]"
        aria-hidden="true"
      />
    </div>
  );
}
