function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <p style={{ padding: 20, textAlign: 'center', color: '#666' }}>No todos found</p>
    );
  }

  const formatDate = date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
          <div style={{ flex: 1 }}>
            <div className='todo-title'>{todo.title}</div>
            {todo.description && <div className='todo-meta'>{todo.description}</div>}
            {todo.dueDate && (
              <div className='todo-meta'>Due: {formatDate(todo.dueDate)}</div>
            )}
          </div>
          <span className={`priority priority-${todo.priority}`}>{todo.priority}</span>
          <button className='btn btn-secondary' onClick={() => onEdit(todo)}>
            Edit
          </button>
          <button className='btn btn-danger' onClick={() => onDelete(todo._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
