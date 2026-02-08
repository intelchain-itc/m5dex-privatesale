import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="auth-page">
    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
  </div>
);

export default SignUpPage;
