import { Badge } from '@/components/ui/badge';

export default function ApplicantProfilePage() {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Personal Info
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Jerome Bell
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <p className="mt-1 text-sm font-medium text-gray-900">Male</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              March 23, 1995 <span className="text-gray-500">(26 y.o)</span>
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Language</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              English, French, Bahasa
            </p>
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              4517 Washington Ave.
              <br />
              Manchester, Kentucky 39495
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Professional Info
        </h3>

        <div className="mb-6">
          <label className="text-sm text-gray-600">About Me</label>
          <p className="mt-2 text-sm leading-relaxed text-gray-900">
            I&apos;m a product designer + filmmaker currently working remotely
            at Twitter from beautiful Manchester, United Kingdom. I&apos;m
            passionate about designing digital products that have a positive
            impact on the world.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-900">
            For 10 years, I&apos;ve specialised in interface, experience &
            interaction design as well as working in user research and product
            strategy for product agencies, big tech companies & start-ups.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Current Job</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Product Designer
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Experience in Years</label>
            <p className="mt-1 text-sm font-medium text-gray-900">4 Years</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">
              Highest Qualification Held
            </label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Bachelors in Engineering
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Skill set</label>
            <div className="mt-2 flex gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Project Management
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Copywriting
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                English
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
