import ROUTES from '@/constants/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Logo = () => (
  <Link href={ROUTES.HOMEPAGE.path}>
    <div className="mb-8 flex cursor-pointer items-center">
      <div className="rounded-full bg-[#5e5cff] p-1.5">
        <CheckCircle size={20} color="white" />
      </div>
      &nbsp;&nbsp;
      <span className="text-xl font-bold">FCareerConnect</span>
    </div>
  </Link>
);

export default Logo;
