import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => (
  <div className="auth-page">
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>Welcome back to M5VF</h2>
          <p>Sign in to manage your holdings, vesting, and referral rewards.</p>
        </div>
      </div>
      <div className="auth-right">
        <div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  </div>
);

export default SignInPage;
