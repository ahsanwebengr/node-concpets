import { useState, useEffect } from 'react';

function TodoForm({ onSubmit, initialData, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
    }
  }, [initialData]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ title, description, priority, dueDate: dueDate || null });
    if (!initialData) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Title</label>
        <input
          type='text'
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='What needs to be done?'
          required
        />
      </div>
      <div className='form-group'>
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Add details...'
          rows={2}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className='form-group'>
          <label>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>
        <div className='form-group'>
          <label>Due Date</label>
          <input type='date' value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>
      <div className='flex gap-2'>
        <button type='submit' className='btn btn-primary'>
          {initialData ? 'Update' : 'Add Todo'}
        </button>
        {onCancel && (
          <button type='button' className='btn btn-secondary' onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
