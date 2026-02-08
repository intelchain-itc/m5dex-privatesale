import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Presale', to: '/dashboard/presale' },
  { label: 'Convert', to: '/dashboard/convert' },
  { label: 'Send/Receive', to: '/dashboard/send-receive' },
  { label: 'Buy Crypto', to: '/dashboard/buy-crypto', disabled: true },
  { label: 'Airdrop Claims', to: '/dashboard/airdrop' },
  { label: 'Carbon Vault', to: '/dashboard/carbon-vault', disabled: true },
  { label: 'Vesting', to: '/dashboard/vesting' },
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
