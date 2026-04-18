import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Shield } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during registration');
    }
  };

  const onAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(adminForm.email, adminForm.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid admin credentials');
    }
  };

  return (
    <div className="flex-center min-h-screen container">
      <div className="glass-card">
        {!showAdminLogin ? (
          <>
            <div className="text-center mb-6">
              <h2 className="mb-4">Create an Account</h2>
              <p style={{ color: 'var(--text-muted)' }}>Start your fitness journey today.</p>
            </div>
            
            {error && <div className="error-msg">{error}</div>}
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group mb-8">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-block mb-4">
                <UserPlus size={20} />
                Sign Up
              </button>
            </form>
            
            <button
              onClick={() => { setShowAdminLogin(true); setError(''); }}
              className="btn btn-block mb-4"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <Shield size={20} />
              Login as Admin
            </button>

            <p className="text-center" style={{ fontSize: '0.875rem' }}>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="mb-4" style={{ color: '#8b5cf6' }}>
                <Shield size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Admin Login
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>Enter your admin credentials to continue.</p>
            </div>
            
            {error && <div className="error-msg">{error}</div>}
            
            <form onSubmit={onAdminLogin}>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group mb-8">
                <label className="form-label">Admin Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-block mb-4" style={{ background: '#8b5cf6', color: '#fff' }}>
                <Shield size={20} />
                Login as Admin
              </button>
            </form>
            
            <button
              onClick={() => { setShowAdminLogin(false); setError(''); }}
              className="btn btn-block"
              style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
