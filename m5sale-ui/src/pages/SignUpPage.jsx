import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="auth-page">
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>Create your M5VF account in seconds</h2>
          <p>Join a beautiful onboarding flow and unlock tiered referral rewards from day one.</p>
        </div>
      </div>
      <div className="auth-right">
        <div>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  </div>
);

export default SignUpPage;
