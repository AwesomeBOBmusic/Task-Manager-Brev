const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const updatedTitle = req.body.title;
  const updatedPriority = req.body.priority;
  const updatedDueDate = req.body.dueDate;
  const updatedTags = req.body.tags;
  try {
    const task = await Task.findByIdAndUpdate(id, { title: updatedTitle, priority: updatedPriority, dueDate: updatedDueDate, tags: updatedTags }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(404).send('Task not found');
  }
};