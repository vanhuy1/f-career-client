import Image from "next/image";
import authbg from "../../../public/Auth/authbg.jpg";

const BackgroundImage = () => (
  <div className="hidden md:block md:w-1/2 relative h-screen">
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
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
