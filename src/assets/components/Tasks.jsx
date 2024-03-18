import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { InputGroup, Form, Button, ListGroup, FormCheck, Dropdown } from 'react-bootstrap';
import { BsSearch, BsTrash, BsPlus, BsChevronDown, BsChevronUp, BsStar, BsStarFill, BsCalendar3 } from 'react-icons/bs';

function Tasks() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState({ name: '', dueDate: null });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [setDueDateOption] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
const [editedTaskContent, setEditedTaskContent] = useState('');

  useEffect(() => {
    const handleClickOutsideContextMenu = (e) => {
      if (!e.target.closest('.context-menu')) {
        setContextMenuVisible(false);
      }
    };

    window.addEventListener('click', handleClickOutsideContextMenu);

    return () => {
      window.removeEventListener('click', handleClickOutsideContextMenu);
    };
  }, [contextMenuVisible]);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleContextMenu = (e, index, isCompletedTask) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
    setSelectedTaskIndex(index);
  };

  const handleContextMenuAction = (action, index, isCompletedTask) => {
    if (action === 'delete') {
      handleDelete(index, isCompletedTask);
    } else if (action === 'edit') {
      const selectedTask = tasks[selectedTaskIndex];
      setEditedTask({ name: selectedTask.name, dueDate: selectedTask.dueDate });
      setEditedTaskIndex(selectedTaskIndex); 
    } else if (action === 'complete') {
      handleToggleDone(index, isCompletedTask);
    } else if (action === 'important') {
      handleToggleImportant(index, isCompletedTask);
    }
    setContextMenuVisible(false);
  };

  const handleDueDateOption = (option) => {
    setDueDateOption(option);
    if (option === 'today') {
      setDueDate(new Date());
    } else if (option === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow);
    } else {
      setDueDate(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() !== '') {
      setTasks([...tasks, { name: task, done: false, important: false, dueDate }]);
      setTask('')
      setDueDate(null);
      setDueDateOption(''); 
    }
  };

  const handleEditTask = (index, content) => {
    setEditedTaskIndex(index);
    setEditedTaskContent(content);
  };
  
  const handleUpdateTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = editedTaskContent;
    setTasks(updatedTasks);
    setEditedTaskIndex(null);
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
    } else {
      const taskToMoveBack = updatedTasks.splice(index, 1)[0];
      setTasks([...updatedTasks, taskToMoveBack]);
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
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item" onContextMenu={(e) => handleContextMenu(e, index, false)}>
                  {editedTaskIndex === index ? (
                    <Form.Control
                      type="text"
                      value={editedTaskContent}
                      onChange={(e) => setEditedTaskContent(e.target.value)}
                      onBlur={() => handleUpdateTask(index)}
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      <FormCheck
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleToggleDone(index)}
                        className="fs-5 me-2"
                      />
                      <span
                        style={{ textDecoration: task.done ? 'line-through' : 'none' }}
                        onClick={() => handleEditTask(index, task.name)}
                      >
                        {task.name}
                      </span>
                    </div>
                  )}
                  <div>
                    <Button className="ms-2 border-0" style={{ background: '#5E1B89' }}>
                      <span className="text-white">Save</span>
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
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item">
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
            <div className="d-flex align-items-center">
              <Dropdown>
                  <Dropdown.Toggle variant="transparent" id="dueDateDropdown" className="border-0 d-flex dropdown-toggle">
                    <BsCalendar3 className="fs-5 icon" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-menu">
                    <Dropdown.Item onClick={() => handleDueDateOption('today')}>Today</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDueDateOption('tomorrow')}>Tomorrow</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDueDateOption('pickDate')}>Pick a Date</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  placeholderText={format(new Date(), 'EEE, dd MMM')}
                  dateFormat="EEE, dd MMM"
                  className="border-0 me-2 rounded border p-2 fs-6"
                />
            </div>
            <Button variant="primary" type="submit" className="border-0" style={{ background: '#5E1B89' }}>
              <BsPlus className="text-white fs-4" />
            </Button>
          </Form.Group>
        </Form>
      </div>
      {contextMenuVisible && (
        <div className="context-menu" style={{ position: 'fixed', top: contextMenuPosition.y, left: contextMenuPosition.x, backgroundColor: '#ffffff', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}>
          <ul className="list-group" style={{ borderRadius: '10px' }}>
            <Button className="list-group-item border-0"  onClick={() => handleContextMenuAction('delete', selectedTaskIndex, false)}>
              Delete
            </Button>
            <Button className="list-group-item border-0" onClick={() => handleContextMenuAction('edit', selectedTaskIndex, false)}>
              Edit
            </Button>
            <Button className="list-group-item border-0" onClick={() => handleContextMenuAction('complete', selectedTaskIndex, false)}>
              {tasks[selectedTaskIndex]?.done ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Button>
            <Button className="list-group-item border-0" onClick={() => handleContextMenuAction('important', selectedTaskIndex, false)}>
              {tasks[selectedTaskIndex]?.important ? 'Unmark as Important' : 'Mark as Important'}
            </Button>
          </ul>
        </div>
      )}

    </>
  );
}

export default Tasks;
