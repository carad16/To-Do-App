import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { InputGroup, Form, Button, ListGroup, FormCheck, Dropdown, Modal } from 'react-bootstrap';
import { BsSearch, BsTrash, BsPlus, BsChevronDown, BsChevronUp, BsStar, BsStarFill, BsCalendar3 } from 'react-icons/bs';

function Tasks() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([{ name: 'Task 1', done: false, important: false, dueDate: new Date() }]);
  const [editedTask, setEditedTask] = useState({ name: '', dueDate: null });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [dueDate, setDueDate] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [cancelHovered, cancelIsHovered] = useState(false);
  const [deleteHovered, deleteIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handleClickOutsideContextMenu = (e) => {
      if (!e.target.closest('.context-menu') && !e.target.closest('.task-edit-form')) {
        setContextMenuVisible(false);
        setEditedTaskIndex(null); 
      }
    };
  
    window.addEventListener('click', handleClickOutsideContextMenu);
  
    return () => {
      window.removeEventListener('click', handleClickOutsideContextMenu);
    };
  }, [contextMenuVisible]);

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
      setTask('');
      setDueDate(null);
    }
  };

  const handleEditTask = (index, content, dueDate) => {
    setEditedTaskIndex(index);
    setEditedTaskContent(content);
    setEditedTask({ name: content, dueDate: dueDate || null });
  };

  const handleUpdateTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = editedTaskContent;
    setTasks(updatedTasks);
    setEditedTaskIndex(null);
  };

  const handleUpdateTaskDueDate = (index, date) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].dueDate = date;
    setTasks(updatedTasks);
  };

  const handleDelete = (index, isCompletedTask) => {
    setShowDeleteModal(true);
    setSelectedTaskIndex(index);
  };

  const confirmDelete = () => {
    if (selectedTaskIndex !== null) {
      const isCompletedTask = completedTasks.findIndex((task, index) => index === selectedTaskIndex) !== -1;
      if (isCompletedTask) {
        const updatedCompletedTasks = completedTasks.filter((_, i) => i !== selectedTaskIndex);
        setCompletedTasks(updatedCompletedTasks);
      } else {
        const updatedTasks = tasks.filter((_, i) => i !== selectedTaskIndex);
        setTasks(updatedTasks);
      }
      setShowDeleteModal(false);
      setSelectedTaskIndex(null);
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
                  <div className="row w-100">
                    <div className="col mt-1">
                      {editedTaskIndex === index ? (
                          <Form.Control
                            type="text"
                            value={editedTaskContent}
                            onChange={(e) => setEditedTaskContent(e.target.value)}
                            onBlur={() => handleUpdateTask(index)}
                            className="w-100 task-edit-form"
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
                            onClick={() => handleEditTask(index, task.name, task.dueDate)} 
                          >
                            {task.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex col-auto">
                      <div className="me-5">
                        <DatePicker
                          selected={task.dueDate}
                          onChange={(date) => handleUpdateTaskDueDate(index, date)}
                          placeholderText={task.dueDate ? format(task.dueDate, 'EEE, dd MMM') : 'No due date'}
                          dateFormat="EEE, dd MMM"
                          wrapperClassName="date-picker-wrapper"
                          className="border-0 rounded border p-2 fs-6"
                        />
                      </div>
                      <div className="d-flex align-items-center position-absolute top-50 end-0 translate-middle-y me-3">
                        <Button
                          variant="link"
                          onClick={() => handleToggleImportant(index)}
                          style={{ color: task.important ? '#ffc107' : '#6c757d' }}
                        >
                          {task.important ? <BsStarFill /> : <BsStar />}
                        </Button>
                        <Button className="border-0" style={{ color: isHovered ? '#ffffff' : '#d11a2a' }} variant="danger" size="sm" onClick={() => handleDelete(index)} onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}>
                          <BsTrash />
                        </Button>
                      </div>
                    </div>
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
            <Button className="list-group-item border-0" onClick={() => handleContextMenuAction('delete', selectedTaskIndex, false)}>
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task?
        </Modal.Body>
        <Modal.Footer>
        <Button
            className="text-white fs-6" style={{ backgroundColor:  cancelHovered ? '#8c8c8c' : '#6c757d', transition: 'background-color 0.3s' }} variant="secondary" onClick={() => setShowDeleteModal(false)}
            onMouseEnter={() => cancelIsHovered(true)}
            onMouseLeave={() =>  cancelIsHovered(false)}
          >
            Cancel
          </Button>
          <Button className="text-white fs-6" style={{ backgroundColor:  deleteHovered ? '#e57373' : '#d11a2a', transition: 'background-color 0.3s' }} variant="danger" onClick={confirmDelete}
           onMouseEnter={() => deleteIsHovered(true)}
           onMouseLeave={() =>  deleteIsHovered(false)} 
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Tasks;
