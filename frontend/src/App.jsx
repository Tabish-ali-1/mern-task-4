import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Nutrition from './components/Nutrition';
import Weight from './components/Weight';
import Goals from './components/Goals';
import SocialShare from './components/SocialShare';
import AdminDashboard from './components/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex-center min-h-screen container"><p>Loading...</p></div>;
  
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { token } = useContext(AuthContext);
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
          <Route path="/weight" element={<PrivateRoute><Weight /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
          <Route path="/share/:id" element={<SocialShare />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
