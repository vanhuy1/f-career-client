import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/navigation";
import Logo from "../_components/Logo";
import Navigation from "../_components/Navigation";
import Divider from "../_components/Divider";
import GoogleSignButton from "../_components/GoogleSignButton";

const SignInForm = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Welcome Back</h1>

    <GoogleSignButton text="Sign In with Google" />

    <Divider />

    <div className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <a href="#" className="text-indigo-600 text-sm font-medium">
          Forgot Password?
        </a>
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
        Sign In
      </Button>

      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <a
          href={ROUTES.AUTH.SIGNUP.path}
          className="text-indigo-600 font-medium">
          {ROUTES.AUTH.SIGNUP.name}
        </a>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By signing in, you acknowledge that you have read and accept the{" "}
        <a href="#" className="text-indigo-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-indigo-600">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  </div>
);

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto w-full">
      <Logo />
      <Navigation />
      <SignInForm />
    </div>
  );
}
