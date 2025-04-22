import Image from 'next/image';

export default function CompanyOfficeImages() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4">
      <div className="col-span-2 md:col-span-1">
        <Image
          src="/team-meeting1.jpg"
          alt="Office space"
          width={800}
          height={600}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div className="col-span-2 grid grid-rows-2 gap-4 md:col-span-1">
        <Image
          src="/team-meeting.jpg"
          alt="Team meeting"
          width={800}
          height={400}
          className="h-full w-full rounded-md object-cover"
        />
        <Image
          src="/team-meeting1.jpg"
          alt="Whiteboard session"
          width={800}
          height={400}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}
