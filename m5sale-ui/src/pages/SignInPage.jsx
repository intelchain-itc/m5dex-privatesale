import { Link } from 'react-router-dom';
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
        <div className="auth-form-wrap">
          <Link className="auth-back-link" to="/">
            ← Back to M5VF Private Sale landing
          </Link>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
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

export default SignInPage;
