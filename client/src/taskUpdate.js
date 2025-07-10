import React, { useState } from 'react';

const TaskUpdate = ({ task, updateTask }) => {
  const [title, setTitle] = useState(task.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(task._id, title);
  };

  return (
    <div>
      <h1>Update Task</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default TaskUpdate;
