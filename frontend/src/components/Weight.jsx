import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Scale, Trash2, Plus } from 'lucide-react';

const Weight = () => {
  const [weights, setWeights] = useState([]);
  const [formData, setFormData] = useState({ weight: '' });

  const fetchWeights = async () => {
    try {
      const res = await api.get('/weight');
      setWeights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/weight', formData);
      setFormData({ weight: '' });
      fetchWeights();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/weight/${id}`);
      fetchWeights();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        <Scale size={24} /> Weight
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          className="input-field"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
          <Plus size={18} /> Add
        </button>
      </form>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {weights.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No weight entries yet.</p> : null}
        {weights.map((w) => (
          <div key={w._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
            <div>
              <h4 style={{ margin: 0 }}>{w.weight} kg</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(w.date).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(w._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weight;
