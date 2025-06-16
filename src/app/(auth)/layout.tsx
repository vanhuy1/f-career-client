import React from 'react';
import Image from 'next/image';
import authbg from '../../../public/Auth/authbg.png';

const BackgroundImage = () => (
  <div className="fixed hidden h-screen md:block md:w-1/2">
    <Image
      src={authbg}
      alt="Background"
      fill
      className="object-cover"
      priority
      loading="eager"
    />
  </div>
);
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <BackgroundImage />
      <div className="w-full md:ml-[50%] md:w-1/2">
        <div className="flex min-h-screen w-full flex-col overflow-y-auto p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
