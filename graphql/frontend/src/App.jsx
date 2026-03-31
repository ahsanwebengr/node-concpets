import { useEffect, useState } from 'react';
import './App.css';

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map(e => e.message).join('\n'));
  }
  return json.data;
}

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [editId, setEditId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const query = `query { users { id name email age } }`;
      const data = await fetchGraphQL(query);
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const clearForm = () => {
    setForm({ name: '', email: '', age: '' });
    setEditId(null);
    setError('');
    setMessage('');
  };

  const onSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    const { name, email, age } = form;
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setSubmitting(true);

    try {
      if (editId) {
        await fetchGraphQL(
          `mutation($id: ID!, $name: String, $email: String, $age: Int) {
            updateUser(id: $id, name: $name, email: $email, age: $age) {
              id
              name
            }
          }`,
          { id: editId, name, email, age: age ? Number(age) : null },
        );
        setMessage('User updated successfully.');
      } else {
        await fetchGraphQL(
          `mutation($name: String!, $email: String!, $age: Int) {
            addUser(name: $name, email: $email, age: $age) {
              id
              name
            }
          }`,
          { name, email, age: age ? Number(age) : null },
        );
        setMessage('User created successfully.');
      }
      clearForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = user => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, age: user.age || '' });
    setError('');
    setMessage('Edit mode: make changes and submit');
  };

  const onDelete = async id => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await fetchGraphQL(`mutation($id: ID!) { deleteUser(id: $id) { id } }`, { id });
      setMessage('User deleted successfully.');
      if (id === editId) clearForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>GraphQL User Manager</h1>
        <p>Simple CRUD dashboard with React + GraphQL + Mongoose.</p>
      </header>

      <div className='content-grid'>
        <form onSubmit={onSubmit} className='user-form card'>
          <h2>{editId ? 'Edit existing user' : 'Create a new user'}</h2>
          {error && <p className='status status-error'>{error}</p>}
          {!error && message && <p className='status status-success'>{message}</p>}

          <label>
            Name
            <input
              value={form.name}
              placeholder='Full name'
              type='text'
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              disabled={submitting}
            />
          </label>

          <label>
            Email
            <input
              value={form.email}
              placeholder='user@example.com'
              type='email'
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              disabled={submitting}
            />
          </label>

          <label>
            Age
            <input
              type='number'
              min='0'
              max='120'
              value={form.age}
              placeholder='Optional age'
              onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
              disabled={submitting}
            />
          </label>

          <div className='form-actions'>
            <button
              type='submit'
              className='btn-primary'
              disabled={submitting || loading}
            >
              {submitting
                ? editId
                  ? 'Updating...'
                  : 'Creating...'
                : editId
                  ? 'Update User'
                  : 'Create User'}
            </button>
            <button type='button' onClick={clearForm} className='btn-secondary'>
              Clear
            </button>
          </div>
        </form>

        <section className='users card'>
          <div className='users-title-row'>
            <h2>User List</h2>
            <span className='badge'>{users.length}</span>
          </div>

          <div className='user-state'>
            {loading && <p>Fetching users... please wait.</p>}
            {!loading && users.length === 0 && <p>No users yet. Create one above.</p>}
          </div>

          <ul className='users-grid'>
            {users.map(user => (
              <li key={user.id} className='user-card'>
                <div>
                  <p className='user-name'>{user.name}</p>
                  <p className='user-email'>{user.email}</p>
                  <p className='user-age'>
                    {user.age ? `Age: ${user.age}` : 'Age: not set'}
                  </p>
                </div>
                <div className='item-actions'>
                  <button className='btn-edit' onClick={() => onEdit(user)}>
                    Edit
                  </button>
                  <button className='btn-delete' onClick={() => onDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
