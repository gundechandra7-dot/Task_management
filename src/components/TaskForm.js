import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function TaskForm({ addTask, selectedDate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [project, setProject] = useState("general");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (selectedDate) {
      const month = "02";
      const day = String(selectedDate).padStart(2, "0");
      setDueDate(`2022-${month}-${day}`);
    }
  }, [selectedDate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    addTask({ title, description, status, project, dueDate: dueDate ? new Date(dueDate) : null });
    setTitle("");
    setDescription("");
    setStatus("pending");
    setProject("general");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={project} onChange={(e) => setProject(e.target.value)}>
        <option value="general">General</option>
        <option value="uiux">UI/UX</option>
        <option value="frontend">Front-End</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">➕ Add Task</button>
    </form>
  );
}

TaskForm.propTypes = {
  addTask: PropTypes.func.isRequired,
  selectedDate: PropTypes.number,
};

export default TaskForm;