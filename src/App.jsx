import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Presale from './pages/Presale.jsx';
import Convert from './pages/Convert.jsx';
import Vesting from './pages/Vesting.jsx';
import Layout from './components/Layout.jsx';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/presale" element={<Presale />} />
      <Route path="/convert" element={<Convert />} />
      <Route path="/vesting" element={<Vesting />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

export default App;
