import Image from 'next/image';

export default function CompaniesSection() {
  return (
    <section className="bg-[#1a1b26] py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-xl text-gray-400 md:text-left">
          Companies we helped grow
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between md:gap-4">
          {/* Vodafone Logo */}
          <div className="relative flex h-12 w-32 items-center">
            <Image
              src="/Logo/vodafone.png"
              alt="Vodafone"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Intel Logo */}
          <div className="relative flex h-12 w-32 items-center">
            <Image
              src="/Logo/intel.png"
              alt="Intel"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Tesla Logo */}
          <div className="relative flex h-12 w-32 items-center">
            <Image
              src="/Logo/tesla.png"
              alt="Tesla"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* AMD Logo */}
          <div className="relative flex h-12 w-32 items-center">
            <Image
              src="/Logo/amd.webp"
              alt="AMD"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Talkit Logo */}
          <div className="relative flex h-12 w-32 items-center">
            <Image
              src="/Logo/vodafone.png"
              alt="Talkit"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
