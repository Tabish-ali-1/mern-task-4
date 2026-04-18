import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Target, Trash2, Plus } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    goalType: 'Weight Loss',
    targetWeight: '',
    targetDate: ''
  });

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', formData);
      setFormData({ goalType: 'Weight Loss', targetWeight: '', targetDate: '' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        <Target size={24} /> Goals
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <select name="goalType" value={formData.goalType} onChange={handleChange} className="input-field" style={{ flex: '1 1 150px' }}>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Endurance">Endurance</option>
          <option value="General Fitness">General Fitness</option>
        </select>
        <input
          type="number"
          name="targetWeight"
          placeholder="Target Weight (kg)"
          className="input-field"
          value={formData.targetWeight}
          onChange={handleChange}
          required
          style={{ flex: '1 1 150px' }}
        />
        <input
          type="date"
          name="targetDate"
          className="input-field"
          value={formData.targetDate}
          onChange={handleChange}
          required
          style={{ flex: '1 1 150px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
          <Plus size={18} /> Add
        </button>
      </form>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {goals.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No goals set yet.</p> : null}
        {goals.map((g) => (
          <div key={g._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
            <div>
              <h4 style={{ margin: 0 }}>{g.goalType}</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Target: {g.targetWeight ? `${g.targetWeight} kg` : '—'} by {g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <button onClick={() => handleDelete(g._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
