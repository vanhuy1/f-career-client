import { Button } from '@/components/ui/button';

export default function JobPostingHero() {
  return (
    <div className="relative w-full overflow-hidden bg-[#4F46E5] text-white">
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-xl">
          <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
            Start posting jobs today
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Start posting jobs for only $10.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white px-6 font-medium text-[#4F46E5] hover:bg-gray-100"
          >
            Sign Up For Free
          </Button>
        </div>
      </div>
      {/* Angled edge */}
      <div
        className="absolute top-0 right-0 h-full w-1/4 translate-x-1/2 skew-x-[-12deg] transform bg-[#1a1a2e]"
        aria-hidden="true"
      />
    </div>
  );
}
