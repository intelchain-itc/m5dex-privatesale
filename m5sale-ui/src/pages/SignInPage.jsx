import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => (
  <div className="auth-page">
    <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
