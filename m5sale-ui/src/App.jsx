import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard.jsx';
import Presale from './pages/Presale.jsx';
import Convert from './pages/Convert.jsx';
import Vesting from './pages/Vesting.jsx';
import Airdrop from './pages/Airdrop.jsx';
import SendReceive from './pages/SendReceive.jsx';
import Landing from './pages/Landing.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Layout from './components/Layout.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/sign-in/*" element={<SignInPage />} />
    <Route path="/sign-up/*" element={<SignUpPage />} />
    <Route
      path="/dashboard/*"
      element={
        <>
          <SignedIn>
            <Layout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="presale" element={<Presale />} />
                <Route path="convert" element={<Convert />} />
                <Route path="send-receive" element={<SendReceive />} />
                <Route path="airdrop" element={<Airdrop />} />
                <Route path="vesting" element={<Vesting />} />
              </Routes>
            </Layout>
          </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
