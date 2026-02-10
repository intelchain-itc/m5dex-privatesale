import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => (
  <div className="auth-page">
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>Welcome back to your premium M5VF portal</h2>
          <p>Sign in to continue your private sale journey with live analytics and secure wallet workflows.</p>
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
