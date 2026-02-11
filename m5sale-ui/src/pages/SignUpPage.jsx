import { Link } from 'react-router-dom';
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
        <div className="auth-form-wrap">
          <Link className="auth-back-link" to="/">
            ← Back to M5VF Private Sale landing
          </Link>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'clerk-auth-root',
                card: 'clerk-auth-card',
              },
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default SignUpPage;
