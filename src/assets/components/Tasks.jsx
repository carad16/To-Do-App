import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { InputGroup, Form, Button, ListGroup, Dropdown, Modal } from 'react-bootstrap';
import { BsSearch, BsTrash, BsPlus, BsChevronDown, BsChevronUp, BsStar, BsStarFill, BsCalendar3, BsThreeDots } from 'react-icons/bs';

function Tasks({ updateTaskCount, setImportantTasks }) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [{ name: 'Task 1', done: false, important: false, dueDate: new Date() }];
  });
  const [editedTask, setEditedTask] = useState({ name: '', dueDate: null });
  const [completedTasks, setCompletedTasks] = useState(() => {
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    return storedCompletedTasks ? JSON.parse(storedCompletedTasks) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [dueDate, setDueDate] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [completeHovered, completeIsHovered] = useState(false);
  const [cancelHovered, cancelIsHovered] = useState(false);
  const [deleteHovered, deleteIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount(tasks.length);
  }, [tasks, updateTaskCount]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

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

  Tasks.propTypes = {
    updateTaskCount: PropTypes.func.isRequired,
    setImportantTasks: PropTypes.func.isRequired,
  };

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSelectAllTasks = () => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      done: true,
    }));
    const updatedCompletedTasks = [...completedTasks, ...updatedTasks];
    setCompletedTasks(updatedCompletedTasks);
    setTasks([]);
  };

  const handleRemoveAllTasks = () => {
    setTasks([]);
  };

  const handleContextMenu = (e, index) => {
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
    if (option === 'pickDate') {
      setShowDatePicker(true);
    } else if (option === 'today') {
      setDueDate(new Date());
    } else if (option === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow);
    } else if (option === 'noDueDate') {
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
    if (editedTaskContent.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[index].name = editedTaskContent;
      if (editedTask.dueDate === 'noDueDate') {
        updatedTasks[index].dueDate = null; 
      } else {
        updatedTasks[index].dueDate = editedTask.dueDate; 
      }
      setTasks(updatedTasks);
      setEditedTaskIndex(null);
    } else {
      setEditedTaskContent(tasks[index].name);
      setEditedTaskIndex(null);
    }
  };

  const handleUpdateTaskDueDate = (index, date) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].dueDate = date;
    setTasks(updatedTasks);
  };

  const handleDelete = (index) => {
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

    if (updatedTasks[index].important) {
      setImportantTasks((prevImportantTasks) => [...prevImportantTasks, updatedTasks[index]]);
    } else {
      setImportantTasks((prevImportantTasks) =>
        prevImportantTasks.filter((task) => task.name !== updatedTasks[index].name)
      );
    }
  };

  const handleToggleDone = (index, isCompletedTask) => {
    if (isCompletedTask) {
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks[index].done = !updatedCompletedTasks[index].done;
      setCompletedTasks(updatedCompletedTasks);
  
      if (!updatedCompletedTasks[index].done) {
        const taskToMoveBack = updatedCompletedTasks.splice(index, 1)[0];
        setTasks([...tasks, taskToMoveBack]);
      }
    } else {
      const updatedTasks = [...tasks];
      updatedTasks[index].done = !updatedTasks[index].done;
      setTasks(updatedTasks);
  
      if (updatedTasks[index].done) {
        const taskToMove = updatedTasks.splice(index, 1)[0];
        setCompletedTasks([...completedTasks, taskToMove]);
      }
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

        <div className="d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-left mb-2 mt-2 roboto-font" style={{ color: '#5E1B89', fontSize: '24px' }}>
            TASKS
          </h1>
          <Dropdown>
            <Dropdown.Toggle variant="transparent" id="tasksDropdown">
              <BsThreeDots className="fs-5 icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleSelectAllTasks}>Done All</Dropdown.Item>
              <Dropdown.Item onClick={handleRemoveAllTasks}>Remove All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {(tasks.length === 0 && searchTerm === '') && (
          <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
            <div>
              <p className="mb-0">No tasks created yet.</p>
            </div>
          </div>
        )}

        {(searchTerm !== '' && filteredTasks.length === 0) && (
          <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
            <div>
              <p className="mb-0">No task found.</p>
            </div>
          </div>
        )}    

        {filteredTasks.length > 0 && (
          <>
            {/* list of tasks added */}
            <ListGroup>
              {filteredTasks.map((task, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item text-justify" onContextMenu={(e) => handleContextMenu(e, index, false)}>
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
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleDone(index)}
                            className="fs-5 me-2 form-check-input rounded-circle"
                          />
                          <span
                            className={`mt-1 ${task.done ? 'text-decoration-line-through' : ''}`}
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
                        <Button className="border-0" style={{ fontSize: '16px', color: isHovered ? '#ffffff' : '#d11a2a' }} variant="danger" size="sm" onClick={() => handleDelete(index)} onMouseEnter={() => setIsHovered(true)}
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
            <h2 className="fw-bold text-left mb-2 mt-4 roboto-font" style={{ color: '#5E1B89', fontSize: '24px' }}>
              COMPLETED TASKS
            </h2>
            
            {/* list of completed tasks */}
            <ListGroup>
              {filteredCompletedTasks.map((task, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item text-justify">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleDone(index, true)}
                      className="fs-5 me-2 form-check-input rounded-circle"
                    />
                    <span className={`mt-1 ${task.done ? 'text-decoration-line-through' : ''}`}>{task.name}</span>
                  </div>
                  <div>
                    <Button variant="link" onClick={() => handleToggleImportant(index, true)} style={{ color: task.important ? '#ffc107' : '#6c757d' }}>
                      {task.important ? <BsStarFill /> : <BsStar />}
                    </Button>
                    <Button className="border-0" style={{ fontSize: '16px', color: completeHovered ? '#ffffff' : '#d11a2a' }} variant="danger" size="sm" onClick={() => handleDelete(index)} onMouseEnter={() => completeIsHovered(true)}
                                onMouseLeave={() => completeIsHovered(false)}>
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {/* task form control */}
        <Form onSubmit={handleSubmit} className="bottom-0 mb-3 mt-3 position-relative bottom-0 start-50 translate-middle-x">
          <Form.Group controlId="taskInput" className="d-flex align-items-center rounded border bg-light p-2">
            <div className="flex-grow-1 me-2">
              <Form.Control
                type="text"
                placeholder="Add a task"
                value={task}
                onChange={handleChange}
                className="border-0 fs-6"
              />
            </div>
            <div className="d-flex align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="dueDateDropdown" className="border-0 d-flex dropdown-toggle">
                  <BsCalendar3 className="fs-5 icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-menu">
                  <Dropdown.Item onClick={() => handleDueDateOption('today')}>Today</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDueDateOption('tomorrow')}>Tomorrow</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDueDateOption('pickDate')}>Pick a Date</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDueDateOption('noDueDate')}>No Due Date</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {dueDate && (
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => {
                    setDueDate(date);
                  }}
                  placeholderText="Select a due date"
                  dateFormat="EEE, dd MMM"
                  className="border-0 rounded p-2 fs-6"
                />
              )}
              <Button variant="primary" type="submit" className="border-0" style={{ background: '#5E1B89' }}>
                <BsPlus className="text-white fs-4" />
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
      {contextMenuVisible && (
        <Dropdown
          className="context-menu"
          style={{ position: 'fixed', top: contextMenuPosition.y, left: contextMenuPosition.x }}
          show={contextMenuVisible}
          onHide={() => setContextMenuVisible(false)}
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleContextMenuAction('delete', selectedTaskIndex, false)}>
              Delete
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleContextMenuAction('edit', selectedTaskIndex, false)}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleContextMenuAction('complete', selectedTaskIndex, false)}>
              {tasks[selectedTaskIndex]?.done ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleContextMenuAction('important', selectedTaskIndex, false)}>
              {tasks[selectedTaskIndex]?.important ? 'Unmark as Important' : 'Mark as Important'}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
