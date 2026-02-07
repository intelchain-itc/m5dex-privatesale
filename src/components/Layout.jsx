import PropTypes from 'prop-types';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

const Layout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-content">
      <TopBar />
      <div className="page-content">{children}</div>
    </div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
