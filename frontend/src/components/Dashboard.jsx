import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Utensils, Scale, Target, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [weights, setWeights] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, nRes, wtRes, gRes] = await Promise.all([
          api.get('/workouts'),
          api.get('/nutrition'),
          api.get('/weight'),
          api.get('/goals'),
        ]);
        setWorkouts(wRes.data);
        setNutritionLogs(nRes.data);
        setWeights(wtRes.data);
        setGoals(gRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Today's calories
  const today = new Date().toDateString();
  const todayCalories = nutritionLogs
    .filter((n) => new Date(n.date).toDateString() === today)
    .reduce((sum, n) => sum + (n.calories || 0), 0);

  // Today's workouts
  const todayWorkouts = workouts.filter((w) => new Date(w.date).toDateString() === today).length;

  // Latest weight
  const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : '—';

  // Active goals
  const activeGoals = goals.filter((g) => g.status === 'In Progress').length;

  // Weight chart data
  const weightChartData = {
    labels: weights.slice(-15).map((w) => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights.slice(-15).map((w) => w.weight),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
      },
    ],
  };

  // Workout frequency (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const workoutFreqData = {
    labels: last7Days.map((d) => d.toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Workouts',
        data: last7Days.map((d) =>
          workouts.filter((w) => new Date(w.date).toDateString() === d.toDateString()).length
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const summaryCards = [
    { label: "Today's Calories", value: `${todayCalories} kcal`, icon: <Utensils size={28} />, color: '#f59e0b' },
    { label: "Today's Workouts", value: todayWorkouts, icon: <Activity size={28} />, color: '#10b981' },
    { label: 'Current Weight', value: latestWeight !== '—' ? `${latestWeight} kg` : '—', icon: <Scale size={28} />, color: '#6366f1' },
    { label: 'Active Goals', value: activeGoals, icon: <Target size={28} />, color: '#8b5cf6' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={28} color="var(--primary)" /> Dashboard
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {summaryCards.map((card) => (
          <div key={card.label} className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
            <div style={{ color: card.color, marginBottom: '0.5rem' }}>{card.icon}</div>
            <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>{card.value}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Weight Trend</h3>
          {weights.length > 0 ? (
            <Line data={weightChartData} options={chartOptions} />
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Log your weight to see the trend chart.</p>
          )}
        </div>
        <div className="glass-card" style={{ maxWidth: '100%', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Workout Frequency (Last 7 Days)</h3>
          <Bar data={workoutFreqData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
