import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Presale', to: '/presale' },
  { label: 'Convert', to: '/convert' },
  { label: 'Send/Receive', to: '/send-receive', disabled: true },
  { label: 'Buy Crypto', to: '/buy-crypto', disabled: true },
  { label: 'Airdrop Claims', to: '/airdrop', disabled: true },
  { label: 'Carbon Vault', to: '/carbon-vault', disabled: true },
  { label: 'Vesting', to: '/vesting' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="brand">
      <div className="logo">M5VF</div>
      <span>Private Sale Portal</span>
    </div>
    <nav className="nav-list">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`
          }
          onClick={(event) => {
            if (item.disabled) {
              event.preventDefault();
            }
          }}
        >
          <span>{item.label}</span>
          {item.disabled && <small>Coming soon</small>}
        </NavLink>
      ))}
    </nav>
    <button className="ghost-button">Connect Email</button>
  </aside>
);

export default Sidebar;
