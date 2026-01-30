import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTenant } from './context/TenantContext';
import TenantSetup from './pages/TenantSetup';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();

  if (authLoading || tenantLoading) {
    return <div className='container'>Loading...</div>;
  }

  if (!tenant) {
    return <TenantSetup />;
  }

  return (
    <Routes>
      <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
      <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
      <Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
    </Routes>
  );
}

export default App;
