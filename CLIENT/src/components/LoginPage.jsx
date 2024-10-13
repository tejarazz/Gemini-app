import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex h-[90vh] justify-center items-center">
      <SignIn path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
};

export default LoginPage;
