import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.brand}>
          <span>🏙️</span>
          <span>CivicAlert</span>
        </Link>

        <div style={s.links}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ ...s.link, ...(isActive('/dashboard') ? s.activeLink : {}) }}>
                🏠 Dashboard
              </Link>
              <Link to="/complaints" style={{ ...s.link, ...(isActive('/complaints') ? s.activeLink : {}) }}>
                📋 Complaints
              </Link>
              <Link to="/complaints/new" style={s.newBtn}>+ Report Issue</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ ...s.link, ...(isActive('/admin') ? s.activeLink : {}) }}>
                  📊 Admin
                </Link>
              )}
              <div style={s.userMenu}>
                <div style={s.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                <span style={s.userName}>{user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...s.link, ...(isActive('/login') ? s.activeLink : {}) }}>Login</Link>
              <Link to="/register" style={s.newBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem', color: '#4f46e5', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '4px' },
  link: { padding: '6px 12px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#64748b', transition: 'all 0.15s', textDecoration: 'none' },
  activeLink: { background: '#f5f3ff', color: '#4f46e5', fontWeight: 600 },
  newBtn: { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.3)', marginLeft: '4px' },
  userMenu: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', paddingLeft: '12px', borderLeft: '1px solid #e2e8f0' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' },
  userName: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  logoutBtn: { background: '#f1f5f9', border: 'none', color: '#64748b', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
};
