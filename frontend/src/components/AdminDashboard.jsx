import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Users, Activity, Utensils, Scale, Target, Trash2, Shield, Lock } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [goals, setGoals] = useState([]);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchStats();
    fetchUsers();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/admin/workouts');
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNutrition = async () => {
    try {
      const res = await api.get('/admin/nutrition');
      setNutritionLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeight = async () => {
    try {
      const res = await api.get('/admin/weight');
      setWeightLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await api.get('/admin/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'workouts') fetchWorkouts();
    else if (tab === 'nutrition') fetchNutrition();
    else if (tab === 'weight') fetchWeight();
    else if (tab === 'goals') fetchGoals();
    else if (tab === 'users') fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and ALL their data? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg(res.data.msg);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.msg || 'Error changing password');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Shield size={18} /> },
    { key: 'users', label: 'Users', icon: <Users size={18} /> },
    { key: 'workouts', label: 'Workouts', icon: <Activity size={18} /> },
    { key: 'nutrition', label: 'Nutrition', icon: <Utensils size={18} /> },
    { key: 'weight', label: 'Weight', icon: <Scale size={18} /> },
    { key: 'goals', label: 'Goals', icon: <Target size={18} /> },
    { key: 'password', label: 'Change Password', icon: <Lock size={18} /> },
  ];

  return (
    <div>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={28} /> Admin Dashboard
      </h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className="btn"
            style={{
              background: activeTab === tab.key ? 'var(--primary)' : 'rgba(99,102,241,0.1)',
              color: activeTab === tab.key ? '#fff' : 'var(--primary)',
              border: '1px solid var(--primary)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: <Users size={32} />, color: '#6366f1' },
            { label: 'Total Workouts', value: stats.totalWorkouts, icon: <Activity size={32} />, color: '#10b981' },
            { label: 'Total Nutrition Logs', value: stats.totalNutrition, icon: <Utensils size={32} />, color: '#f59e0b' },
            { label: 'Total Weight Logs', value: stats.totalWeightLogs, icon: <Scale size={32} />, color: '#ef4444' },
            { label: 'Total Goals', value: stats.totalGoals, icon: <Target size={32} />, color: '#8b5cf6' },
          ].map((card) => (
            <div key={card.label} className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: card.color, marginBottom: '0.5rem' }}>{card.icon}</div>
              <h3 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>{card.value}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>All Users ({users.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Joined</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Admin</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{u.isAdmin ? '✅' : '❌'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {!u.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>All Workouts ({workouts.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Duration</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Intensity</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((w) => (
                <tr key={w._id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{w.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem' }}>{w.exerciseType}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{w.duration} min</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{w.intensity}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(w.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {workouts.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No workouts logged yet.</p>}
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === 'nutrition' && (
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>All Nutrition Logs ({nutritionLogs.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Meal</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Calories</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Protein</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Carbs</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Fat</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {nutritionLogs.map((n) => (
                <tr key={n._id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{n.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem' }}>{n.meal}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{n.calories}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{n.macros?.protein}g</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{n.macros?.carbs}g</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{n.macros?.fat}g</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {nutritionLogs.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No nutrition logs yet.</p>}
        </div>
      )}

      {/* Weight Tab */}
      {activeTab === 'weight' && (
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>All Weight Logs ({weightLogs.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Weight (kg)</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map((w) => (
                <tr key={w._id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{w.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{w.weight}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(w.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {weightLogs.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No weight logs yet.</p>}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>All Goals ({goals.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Goal Type</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Target</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Deadline</th>
                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g) => (
                <tr key={g._id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{g.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem' }}>{g.goalType}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{g.targetWeight ? `${g.targetWeight} kg` : '—'}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: g.status === 'Completed' ? 'rgba(16,185,129,0.15)' : g.status === 'Abandoned' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                      color: g.status === 'Completed' ? '#10b981' : g.status === 'Abandoned' ? '#ef4444' : '#6366f1',
                    }}>{g.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {goals.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No goals set yet.</p>}
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="glass-card" style={{ maxWidth: '450px', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={24} /> Change Admin Password
          </h3>

          {passwordMsg && <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(16,185,129,0.2)' }}>{passwordMsg}</div>}
          {passwordError && <div className="error-msg">{passwordError}</div>}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              <Lock size={18} /> Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
