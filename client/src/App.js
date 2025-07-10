import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import TaskUpdate from './taskUpdate';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

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
      const res = await axios.post('/api/tasks', {
        title,
        priority: priority || 'low',
        dueDate,
        tags: selectedTag ? [selectedTag] : []
      });
      setTasks([...tasks, res.data]);
      setTitle('');
      setPriority('');
      setDueDate(new Date());
      setTags([...tags, res.data]);
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

  const updateTask = async (id, updatedTitle, updatedPriority, updatedDueDate) => {
    try {
      const res = await axios.put(`/api/tasks/edit/${id}`, {
        title: updatedTitle,
        priority: updatedPriority,
        dueDate: updatedDueDate,
        tags: selectedTag ? [selectedTag] : []
      });
      const updatedTasks = tasks.map(task =>
        task._id === id ? { ...task, title: res.data.title, priority: res.data.priority, dueDate: res.data.dueDate, tags: res.data.tags } : task
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
              <h3>New task</h3>
              <label>Title: </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Bob's task"
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
              <button onClick={addTask}>Add</button>

              <ul>
                {tasks.map(task => (
                  <li key={task._id}>
                    <label>Title: </label>
                    {task.title}{" "}
                    <br />
                    <label>Priority: </label>
                    {task.priority}{" "}
                    <br />
                    <label>Due Date: </label>
                    {moment(task.dueDate).format('DD-MM-YYYY')}{" "}
                    <br />
                    <label>Tags: </label>
                    {task.tags.join(', ')}{" "}
                    <br />
                    <button onClick={() => deleteTask(task._id)}>❌</button>{" "}
                    <a href={`/edit/${task._id}`}>
                      <button>✏️</button>
                    </a>
                    <hr />
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
      updateTask={(taskId, newTitle, newPriority, newDueDate, newTags) => {
        updateTask(taskId, newTitle, newPriority, newDueDate, newTags);
        navigate('/');
      }}
    />
  );
}

export default App;