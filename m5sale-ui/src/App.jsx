import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Presale from './pages/Presale.jsx';
import Convert from './pages/Convert.jsx';
import Vesting from './pages/Vesting.jsx';
import Airdrop from './pages/Airdrop.jsx';
import SendReceive from './pages/SendReceive.jsx';
import Layout from './components/Layout.jsx';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/presale" element={<Presale />} />
      <Route path="/convert" element={<Convert />} />
      <Route path="/send-receive" element={<SendReceive />} />
      <Route path="/airdrop" element={<Airdrop />} />
      <Route path="/vesting" element={<Vesting />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

export default App;
