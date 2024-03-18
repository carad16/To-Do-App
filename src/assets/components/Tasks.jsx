import React, { useState } from 'react';
import { InputGroup, Form, Button, ListGroup, FormCheck } from 'react-bootstrap';
import { BsSearch, BsTrash, BsPlus, BsChevronDown, BsChevronUp, BsStar, BsStarFill } from 'react-icons/bs';

function Tasks() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() !== '') {
      setTasks([...tasks, { name: task, done: false, important: false }]);
      setTask('');
    }
  };

  const handleDelete = (index, isCompletedTask) => {
    if (isCompletedTask) {
      const updatedCompletedTasks = completedTasks.filter((_, i) => i !== index);
      setCompletedTasks(updatedCompletedTasks);
    } else {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  };

  const handleToggleImportant = (index, isCompletedTask) => {
    const updatedTasks = isCompletedTask ? [...completedTasks] : [...tasks];
    updatedTasks[index].important = !updatedTasks[index].important;
    isCompletedTask ? setCompletedTasks(updatedTasks) : setTasks(updatedTasks);
  };

  const handleToggleDone = (index, isCompletedTask) => {
    if (isCompletedTask) {
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks[index].done = !updatedCompletedTasks[index].done;
      if (!updatedCompletedTasks[index].done) {
        const taskToMoveBack = updatedCompletedTasks.splice(index, 1)[0];
        setTasks([...tasks, taskToMoveBack]);
      }
      setCompletedTasks(updatedCompletedTasks);
    } else {
      const updatedTasks = [...tasks];
      updatedTasks[index].done = !updatedTasks[index].done;
      if (updatedTasks[index].done) {
        const taskToMove = updatedTasks.splice(index, 1)[0];
        setCompletedTasks([...completedTasks, taskToMove]);
      }
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedTasks = completedTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container mt-2">
        {/* search bar */}
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-1 mb-3"
            style={{ fontSize: '18px' }}
          />
          <InputGroup.Text className="bg-transparent mb-3">
            <BsSearch />
          </InputGroup.Text>
        </InputGroup>

        <h1 className="fw-bold text-left mb-4" style={{ color: '#5E1B89', fontSize: '28px' }}>
          Tasks
        </h1>

        {filteredTasks.length === 0 && tasks.length === 0 && (
          <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
            <div>
              <p className="mb-0">No tasks created yet.</p>
            </div>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <>
            {/* list of tasks added */}
            <ListGroup>
              {filteredTasks.map((task, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FormCheck
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleDone(index)}
                      className="fs-5 me-2"
                    />
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.name}</span>
                  </div>
                  <div>
                    <Button
                      variant="link"
                      onClick={() => handleToggleImportant(index)}
                      style={{ color: task.important ? '#ffc107' : '#6c757d' }}
                    >
                      {task.important ? <BsStarFill /> : <BsStar />}
                    </Button>
                    <Button style={{ backgroundColor: '#d11a2a' }} variant="danger" size="sm" onClick={() => handleDelete(index)}>
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {/* toggle button for completed tasks */}
        <Button
          variant="primary"
          onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          className="mt-3 d-flex align-items-center text-white"
          style={{ fontSize: '13px', backgroundColor: showCompletedTasks ? '#F4512C' : '#5E1B89', border: '#5E1B89'}}
        >
          {showCompletedTasks ? 'Completed Tasks' : 'Completed Tasks'}
          {showCompletedTasks ? <BsChevronUp className="ms-2" /> : <BsChevronDown className="ms-2" />}
        </Button>

        {showCompletedTasks && filteredCompletedTasks.length > 0 && (
          <>
            <h2 className="fw-bold text-left mb-4 mt-4" style={{ color: '#5E1B89', fontSize: '28px' }}>
              Completed Tasks
            </h2>
            
            {/* list of completed tasks */}
            <ListGroup>
              {filteredCompletedTasks.map((task, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FormCheck
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleDone(index, true)}
                      className="fs-5 me-2"
                    />
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.name}</span>
                  </div>
                  <div>
                    <Button variant="link" onClick={() => handleToggleImportant(index, true)} style={{ color: task.important ? '#ffc107' : '#6c757d' }}>
                      {task.important ? <BsStarFill /> : <BsStar />}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(index, true)} style={{ backgroundColor: '#d11a2a'  }}>
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {/* task form control */}
        <Form onSubmit={handleSubmit} className="bottom-0 mb-3 mt-3">
          <Form.Group controlId="taskInput" className="d-flex align-items-center rounded border bg-light p-2">
            <Form.Control
              type="text"
              placeholder="Add a task"
              value={task}
              onChange={handleChange}
              className="border-0 flex-grow-1 me-2 fs-6"
            />
            <Button variant="primary" type="submit" className="border-0" style={{ background: '#0078d4' }}>
              <BsPlus className="text-white fs-4" />
            </Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default Tasks;
