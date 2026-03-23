import React, { useState } from "react";
import PropTypes from 'prop-types';

const taskIcons = {
  'Design Changes': '🎨',
  'Sprint Design': '📐',
  'Front-End Follow Up': '👁️',
  'default': '📝'
};

function TaskItem({ task, updateTask, deleteTask, isProgress = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");

  const handleSave = () => {
    updateTask(task.id, { title, description, status, dueDate: dueDate ? new Date(dueDate) : null });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    setIsEditing(false);
  };

  const getIcon = (title) => taskIcons[title] || taskIcons['default'];

  if (isEditing) {
    return (
      <li className="task-item">
        <div className="edit-form" style={{ width: '100%' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={handleCancel}>❌ Cancel</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="task-item">
      <div className="task-icon">{getIcon(task.title)}</div>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`status-badge status-${task.status}`}>
            {task.status === 'pending' && '⏳'}
            {task.status === 'in-progress' && '⚡'}
            {task.status === 'completed' && '✓'}
            {' ' + task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
          </span>
          {task.dueDate && <span style={{ fontSize: '0.85rem', color: '#8b92a0' }}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => setIsEditing(true)}>✏️</button>
        <button onClick={() => deleteTask(task.id)} className="delete">🗑️</button>
      </div>
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  isProgress: PropTypes.bool,
};

function TaskList({ tasks, updateTask, deleteTask, isProgress = false }) {
  const filterTasks = () => {
    if (isProgress) {
      return tasks.filter(t => t.status === 'in-progress');
    }
    return tasks;
  };

  const filteredTasks = filterTasks();

  return (
    <ul className="task-list">
      {filteredTasks.length === 0 ? (
        <li style={{ padding: '20px', textAlign: 'center', color: '#8b92a0' }}>
          No tasks yet. Create one to get started! ✨
        </li>
      ) : (
        filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} isProgress={isProgress} />
        ))
      )}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  isProgress: PropTypes.bool,
};

export default TaskList;