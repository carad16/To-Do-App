import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './assets/components/Sidebar.jsx'
import Tasks from './assets/components/Tasks.jsx'
import Important from './assets/components/Important.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <Sidebar className="font-sans" />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/important" element={<Important />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
