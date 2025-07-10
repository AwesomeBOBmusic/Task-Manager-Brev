import React, { useState } from 'react';

const TaskUpdate = ({ task, updateTask }) => {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate instanceof Date && !isNaN(task.dueDate)
      ? task.dueDate
      : new Date(task.dueDate)
  );
  const [tags, setTags] = useState(task.tags || []);
  const [selectedTag, setSelectedTag] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Please enter a title');
      return;
    }
    updateTask(task._id, title, priority, dueDate);
  };

  return (
    <div>
      <h1>Update Task</h1>
      <form onSubmit={handleSubmit}>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <label>Priority: </label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <br />
        <label>Due Date: </label>
        <input
          type="date"
          value={
            dueDate instanceof Date && !isNaN(dueDate)
              ? dueDate.toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => setDueDate(new Date(e.target.value))}
        />
        <br />
        <br />
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <br />
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default TaskUpdate;