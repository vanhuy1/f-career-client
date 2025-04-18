import React from 'react';
import Image from 'next/image';
import authbg from '../../../public/Auth/authbg.jpg';

const BackgroundImage = () => (
  <div className="relative hidden h-screen md:block md:w-1/2">
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
      <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-12">
        {children}
      </div>
    </div>
  );
}
