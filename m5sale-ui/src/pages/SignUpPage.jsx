import { Link } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const SignUpPage = () => (
  <div className="auth-page">
    <Card className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>Create your M5VF account in seconds</h2>
          <p>Join a beautiful onboarding flow and unlock tiered referral rewards from day one.</p>
        </div>
      </div>
      <CardContent className="auth-right auth-form-wrap p-10">
        <Button asChild variant="ghost" className="auth-back-link w-fit px-0 hover:bg-transparent">
          <Link to="/">← Back to M5VF Private Sale landing</Link>
        </Button>
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
      </CardContent>
    </Card>
  </div>
);

export default SignUpPage;
