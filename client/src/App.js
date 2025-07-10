import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import TaskUpdate from './taskUpdate';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post('/api/tasks', { title });
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id, updatedTitle) => {
    try {
      const res = await axios.put(`/api/tasks/edit/${id}`, { title: updatedTitle });
      const updatedTasks = tasks.map(task =>
        task._id === id ? { ...task, title: res.data.title } : task
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
                    <button onClick={() => deleteTask(task._id)}>❌</button>{" "}
                    <a href={`/edit/${task._id}`}>
                      <button>✏️</button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route
          path="/edit/:id"
          element={<EditTaskPage tasks={tasks} updateTask={updateTask} />}
        />
      </Routes>
    </Router>
  );
}

function EditTaskPage({ tasks, updateTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t._id === id);

  if (!task) return <div>Task not found</div>;

  return (
    <TaskUpdate
      task={task}
      updateTask={(taskId, newTitle) => {
        updateTask(taskId, newTitle);
        navigate('/');
      }}
    />
  );
}

export default App;