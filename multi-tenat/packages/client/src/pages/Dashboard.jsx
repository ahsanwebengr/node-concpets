import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import api from '../services/api';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

function Dashboard() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = async () => {
    const params = {};
    if (filter === 'active') params.completed = false;
    if (filter === 'completed') params.completed = true;

    const res = await api.get('/todos', { params });
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const handleCreate = async data => {
    await api.post('/todos', data);
    fetchTodos();
  };

  const handleUpdate = async (id, data) => {
    await api.put(`/todos/${id}`, data);
    setEditingTodo(null);
    fetchTodos();
  };

  const handleDelete = async id => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  const handleToggle = async todo => {
    await api.put(`/todos/${todo._id}`, { ...todo, completed: !todo.completed });
    fetchTodos();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <div className='header'>
        <h1>Todo App</h1>
        <div className='flex gap-2' style={{ alignItems: 'center' }}>
          <span className='tenant-badge'>{tenant}</span>
          <span style={{ fontSize: 14 }}>{user?.name}</span>
          <button className='btn btn-secondary' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className='container'>
        <div className='card'>
          <h3 style={{ marginBottom: 16 }}>{editingTodo ? 'Edit Todo' : 'Add Todo'}</h3>
          <TodoForm
            onSubmit={
              editingTodo ? data => handleUpdate(editingTodo._id, data) : handleCreate
            }
            initialData={editingTodo}
            onCancel={editingTodo ? () => setEditingTodo(null) : null}
          />
        </div>

        <div className='card'>
          <div className='tabs'>
            <button
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onEdit={setEditingTodo}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
