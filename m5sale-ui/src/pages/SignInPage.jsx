import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const SignInPage = () => (
  <div className="auth-page">
    <Card className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>Welcome back to your premium M5VF portal</h2>
          <p>Sign in to continue your private sale journey with live analytics and secure wallet workflows.</p>
        </div>
      </div>
      <CardContent className="auth-right auth-form-wrap p-10">
        <Button asChild variant="ghost" className="auth-back-link w-fit px-0 hover:bg-transparent">
          <Link to="/">← Back to M5VF Private Sale landing</Link>
        </Button>
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
      </CardContent>
    </Card>
  </div>
);

export default SignInPage;
