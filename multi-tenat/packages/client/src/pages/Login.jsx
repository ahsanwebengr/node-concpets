import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';

function Login() {
  const { login } = useAuth();
  const { tenant } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className='auth-container'>
      <div className='card auth-card'>
        <h2 className='text-center' style={{ marginBottom: 8 }}>
          Login
        </h2>
        <p className='text-center' style={{ marginBottom: 24 }}>
          <span className='tenant-badge'>{tenant}</span>
        </p>

        {error && <div className='error'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary' style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <p className='text-center mt-2'>
          Don't have an account?{' '}
          <Link to='/register' className='link'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
