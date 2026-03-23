import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activeNav, setActiveNav] = useState("home");
  const [activeTab, setActiveTab] = useState("all");
  const [activeDate, setActiveDate] = useState(null);
  const taskFormRef = useRef(null);

  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === "uiux") return task.project === "uiux";
      if (activeTab === "frontend") return task.project === "frontend";
      return true;
    })
    .filter((task) => {
      if (activeDate === null) return true;
      if (!task.dueDate) return true;
      const due = new Date(task.dueDate);
      return due.getDate() === activeDate;
    });

  useEffect(() => {
    if (!currentUser) return;
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`) || '[]');
    setTasks(savedTasks);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
  }, [tasks, currentUser]);

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now().toString(), userId: currentUser.id };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => task.id === id ? { ...updatedTask, id, userId: currentUser.id } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  if (!currentUser) {
    return <Login />;
  }

  const sampleProjects = [
    { id: 1, icon: '📱', title: 'UI/UX Designing', code: 'Project #24', date: 'January 20, 2022', color: 'dark' },
    { id: 2, icon: '🚀', title: 'Front-End Development', code: 'Project #25', date: 'February 15, 2022', color: 'light' },
  ];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveNav('tasks');
  };

  const handleDateClick = (day) => {
    setActiveDate(day);
    setActiveNav('tasks');
  };

  const handleAddTaskClick = () => {
    taskFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav('tasks');
  };

  return (
    <div className="container">
      <div className="header" style={{ gridColumn: '1 / -1' }}>
        <div className="header-greeting">
          <h2>{getGreeting()}, {currentUser.email.split('@')[0]}!</h2>
          <p>Have a nice day.</p>
        </div>
        <button onClick={logout} className="logout-btn">🚪 Logout</button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>All</button>
        <button className={`tab-button ${activeTab === 'uiux' ? 'active' : ''}`} onClick={() => handleTabClick('uiux')}>UI / UX Projects</button>
        <button className={`tab-button ${activeTab === 'frontend' ? 'active' : ''}`} onClick={() => handleTabClick('frontend')}>Front-End Development</button>
      </div>

      {(activeNav === 'home') && (
        <div className="projects-section">
          <div className="projects-grid">
            {sampleProjects.map(project => (
              <div
                key={project.id}
                className={`project-card ${project.color === 'light' ? 'light' : ''}`}
                onClick={() => handleTabClick(project.id === 1 ? 'uiux' : 'frontend')}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-icon">{project.icon}</div>
                <div className="project-title">{project.title}</div>
                <div className="project-code">{project.code}</div>
                <div className="project-date">{project.date}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#1a1a2e', marginTop: '30px' }}>Progress</h3>
            <TaskList tasks={filteredTasks} updateTask={updateTask} deleteTask={deleteTask} isProgress={true} />
          </div>
        </div>
      )}

      {(activeNav === 'home' || activeNav === 'tasks') && (
        <div className="tasks-section">
          <div className="date-picker-container">
            <div className="date-header">
              <h3>📅 Feb, 2022</h3>
              <button className="add-task-btn" onClick={handleAddTaskClick}>➕ Add Task</button>
            </div>
            <div className="calendar">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="calendar-day">{day}</div>
              ))}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                return (
                  <div
                    key={day}
                    className={`calendar-date ${activeDate === day ? 'active' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={taskFormRef}>
            <h3 style={{ color: '#1a1a2e', marginBottom: '15px' }}>📋 Tasks</h3>
            <TaskForm addTask={addTask} selectedDate={activeDate} />
            <TaskList tasks={filteredTasks} updateTask={updateTask} deleteTask={deleteTask} />
          </div>
        </div>
      )}

      {activeNav === 'notifications' && (
        <div className="tasks-section" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <h3>🔔 Notifications</h3>
          <p>No new notifications yet. You're all caught up!</p>
        </div>
      )}

      {activeNav === 'profile' && (
        <div className="tasks-section" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <h3>👤 Profile</h3>
          <p><strong>{currentUser.email}</strong></p>
          <p>Task count: {tasks.length}</p>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
          onClick={() => setActiveNav('home')}
        >
          🏠
        </button>
        <button 
          className={`nav-item ${activeNav === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveNav('tasks')}
        >
          ✓
        </button>
        <button 
          className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveNav('notifications')}
        >
          🔔
        </button>
        <button 
          className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveNav('profile')}
        >
          👤
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
