import ROUTES from "@/constants/navigation";

const Logo = () => (
  <a href={ROUTES.HOMEPAGE.path}>
    <div className="flex items-center mb-8 cursor-pointer">
      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <span className="text-white font-bold">F</span>
      </div>
      <span className="ml-2 text-xl font-bold">FCareerConnect</span>
    </div>
  </a>
);

export default Logo;
