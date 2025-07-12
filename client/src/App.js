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

  const fetchTags = async () => {
    try {
      const res = await axios.get('/api/tags');
      setTags(res.data);
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
      setSelectedTag('');
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

  const updateTask = async (id, updatedTitle, updatedPriority, updatedDueDate, updatedTags) => {
    try {
      const res = await axios.put(`/api/tasks/edit/${id}`, {
        title: updatedTitle,
        priority: updatedPriority,
        dueDate: updatedDueDate,
        tags: updatedTags || []
      });
      const updatedTasks = tasks.map(task =>
        task._id === id ? res.data : task
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const addTags = async (newTags) => {
    try {
      const res = await axios.post('/api/tags/add', { tags: newTags });
      const cleanTags = res.data.map(tag => tag.toLowerCase());
      setTags(prev => Array.from(new Set([...prev, ...cleanTags])));
    } catch (err) {
      console.error('Failed to add tags:', err);
    }
  };

  const updateTag = async (id, updatedType) => {
    try {
      const res = await axios.put(`/api/tags/edit/${id}`, {
        type: updatedType,
      });
      const updateTag = tags.map(tags =>
        tags._id === id ? res.data : tags
      );
      setTags(updateTag);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTags();
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
              <br /><br />

              <label>Priority: </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <br /><br />

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
              <br /><br />

              <label>Tag: </label>
              <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">No tag</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <a href="/add/tags">
                <button type="button">➕</button>{' '}
              </a>
              <a href="/edit/tags">
              <button type="button">✏️</button>
              </a>
              <br /><br />

              <button onClick={addTask}>Add</button>

              <ul>
                {tasks.map(task => (
                  <li key={task._id}>
                    <label>Title: </label>{task.title}<br />
                    <label>Priority: </label>{task.priority}<br />
                    <label>Due Date: </label>{moment(task.dueDate).format('DD-MM-YYYY')}<br />
                    <label>Tags: </label>{(task.tags || []).join(', ')}<br />
                    <button onClick={() => deleteTask(task._id)}>❌</button>{' '}
                    <a href={`/edit/${task._id}`}>
                      <button type="button">✏️</button>
                    </a>
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route
          path="/add/tags"
          element={<AddingTagsPage tags={tags} addTags={addTags} />}
        />
        <Route
          path="/edit/:id"
          element={<EditTaskPage tasks={tasks} updateTask={updateTask} tags={tags} />}
        />
      </Routes>
    </Router>
  );
}

function EditTaskPage({ tasks, updateTask, tags }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t._id === id);

  if (!task) return <div>Task not found</div>;

  return (
    <TaskUpdate
      task={task}
      tags={tags}
      updateTask={(taskId, newTitle, newPriority, newDueDate, newTags) => {
        updateTask(taskId, newTitle, newPriority, newDueDate, newTags);
        navigate('/');
      }}
    />
  );
}

function AddingTagsPage({ tags, addTags }) {
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    addTags([newTag]);
    setNewTag('');
    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="New tag"
      />
      <button type="submit">Add Tag</button>
    </form>
  );
}

export default App;
