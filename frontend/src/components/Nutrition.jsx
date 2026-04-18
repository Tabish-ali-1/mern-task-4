import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Plus, Utensils } from 'lucide-react';

const Nutrition = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [formData, setFormData] = useState({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const fetchNutrition = async () => {
    try {
      const res = await api.get('/nutrition');
      setNutritionLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        meal: formData.meal,
        calories: formData.calories,
        macros: {
          protein: formData.protein || 0,
          carbs: formData.carbs || 0,
          fat: formData.fat || 0
        }
      };
      await api.post('/nutrition', payload);
      setFormData({ meal: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchNutrition();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/nutrition/${id}`);
      fetchNutrition();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '100%' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        <Utensils size={24} /> Nutrition
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input type="text" className="input-field" placeholder="Meal Name" name="meal" value={formData.meal} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <input type="number" className="input-field" placeholder="Calories" name="calories" value={formData.calories} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <input type="number" className="input-field" placeholder="Protein (g)" name="protein" value={formData.protein} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <input type="number" className="input-field" placeholder="Carbs (g)" name="carbs" value={formData.carbs} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <input type="number" className="input-field" placeholder="Fat (g)" name="fat" value={formData.fat} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {nutritionLogs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No nutrition logged yet.</p> : null}
        {nutritionLogs.map(log => (
          <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{log.meal}</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {log.calories} kcal • P: {log.macros?.protein}g • C: {log.macros?.carbs}g • F: {log.macros?.fat}g • {new Date(log.date).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDelete(log._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nutrition;
