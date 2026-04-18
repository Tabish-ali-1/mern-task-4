import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Activity, Shield } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <nav className="glass-nav" style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <Activity color="var(--primary)" size={28} />
          <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>FitnessTracker</h2>
        </div>
        {user && (
          <div className="flex-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem' }}>Hi, {user.name || 'User'}!</span>
            {user.isAdmin ? (
              <NavLink to="/admin" className="nav-link" style={({ isActive }) => ({
                color: isActive ? '#8b5cf6' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              })}>
                <Shield size={16} /> Admin
              </NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className="nav-link" style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                })}>Dashboard</NavLink>
                <NavLink to="/workouts" className="nav-link" style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                })}>Workouts</NavLink>
                <NavLink to="/nutrition" className="nav-link" style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                })}>Nutrition</NavLink>
                <NavLink to="/weight" className="nav-link" style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                })}>Weight</NavLink>
                <NavLink to="/goals" className="nav-link" style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                })}>Goals</NavLink>
              </>
            )}
            <button onClick={handleLogout} className="btn" style={{
              background: 'rgba(239,68,68,0.1)',
              color: 'var(--error)',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
            }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </nav>
      <main className="container" style={{ padding: '2rem' }}>{children}</main>
    </div>
  );
};

export default Layout;
