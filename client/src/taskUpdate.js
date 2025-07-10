import React, { useState } from 'react';

const TaskUpdate = ({ task, updateTask }) => {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Please enter a title');
      return;
    }
    updateTask(task._id, title, priority);
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default TaskUpdate;