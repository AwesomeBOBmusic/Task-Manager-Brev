import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('/api/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post('/api/tasks', { title });
    setTitle('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title}{" "}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;