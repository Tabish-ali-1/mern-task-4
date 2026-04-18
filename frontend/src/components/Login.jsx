import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during login');
    }
  };

  return (
    <div className="flex-center min-h-screen container">
      <div className="glass-card">
        <div className="text-center mb-6">
          <h2 className="mb-4">Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue tracking your fitness goals.</p>
        </div>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={onSubmit}>
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
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block mb-4">
            <LogIn size={20} />
            Sign In
          </button>
        </form>
        
        <p className="text-center" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
