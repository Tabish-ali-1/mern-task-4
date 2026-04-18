import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Activity, Trash2, Plus } from 'lucide-react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    exerciseType: '',
    duration: '',
    intensity: 'Medium'
  });

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workouts', formData);
      setFormData({ exerciseType: '', duration: '', intensity: 'Medium' });
      fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '100%' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        <Activity size={24} /> Workouts
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Exercise (e.g. Running)"
            name="exerciseType"
            value={formData.exerciseType}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <input
            type="number"
            className="input-field"
            placeholder="Duration (mins)"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <select className="input-field" name="intensity" value={formData.intensity} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {workouts.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No workouts logged yet.</p> : null}
        {workouts.map(workout => (
          <div key={workout._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{workout.exerciseType}</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {workout.duration} mins • {workout.intensity} Intensity • {new Date(workout.date).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDelete(workout._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
