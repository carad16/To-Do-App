import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from './assets/components/Sidebar.jsx';
import Tasks from './assets/components/Tasks.jsx';
import Important from './assets/components/Important.jsx';
import RecentlyDeleted from './assets/components/RecentlyDeleted.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [importantTasks, setImportantTasks] = useState(() => {
    const storedTasks = localStorage.getItem('importantTasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [recentlyDeletedTasks, setRecentlyDeletedTasks] = useState(() => {
    const storedTasks = localStorage.getItem('recentlyDeletedTasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const restoreTask = (task) => {
    console.log('Restoring Task:', task);
    setTasks([...tasks, task]); 
    setRecentlyDeletedTasks(recentlyDeletedTasks.filter((t) => t !== task));
    localStorage.setItem('tasks', JSON.stringify(recentlyDeletedTasks.filter((t) => t !== task)));
  };

  const updateTaskCount = (count) => {
    setTaskCount(count);
  };

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <Sidebar taskCount={taskCount} />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route
                path="/important"
                element={<Important importantTasks={importantTasks} />}
              />
              <Route
                path="/"
                element={<Tasks updateTaskCount={updateTaskCount} setImportantTasks={setImportantTasks} setRecentlyDeletedTasks={setRecentlyDeletedTasks} setTasks={setTasks} tasks={tasks} />}
              />
              <Route
                path="/recentlydeleted"
                element={<RecentlyDeleted recentlyDeletedTasks={recentlyDeletedTasks} setRecentlyDeletedTasks={setRecentlyDeletedTasks} restoreTask={restoreTask} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
