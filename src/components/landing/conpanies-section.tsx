import Image from "next/image";

export default function CompaniesSection() {
  return (
    <section className="bg-[#1a1b26] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-gray-400 text-xl mb-12 text-center md:text-left">
          Companies we helped grow
        </h2>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
          {/* Vodafone Logo */}
          <div className="w-32 h-12 relative flex items-center">
            <Image
              src="/placeholder.svg?height=48&width=128"
              alt="Vodafone"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Intel Logo */}
          <div className="w-32 h-12 relative flex items-center">
            <Image
              src="/placeholder.svg?height=48&width=128"
              alt="Intel"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Tesla Logo */}
          <div className="w-32 h-12 relative flex items-center">
            <Image
              src="/placeholder.svg?height=48&width=128"
              alt="Tesla"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* AMD Logo */}
          <div className="w-32 h-12 relative flex items-center">
            <Image
              src="/placeholder.svg?height=48&width=128"
              alt="AMD"
              width={128}
              height={48}
              className="opacity-60"
            />
          </div>

          {/* Talkit Logo */}
          <div className="w-32 h-12 relative flex items-center">
            <Image
              src="/placeholder.svg?height=48&width=128"
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
