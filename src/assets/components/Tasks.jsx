import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { InputGroup, Form, Button, ListGroup, Dropdown, Modal } from 'react-bootstrap';
import { BsSearch, BsTrash, BsPlus, BsChevronDown, BsChevronUp, BsStar, BsStarFill, BsCalendar3, BsThreeDots } from 'react-icons/bs';

function Tasks({ updateTaskCount, setImportantTasks, setRecentlyDeletedTasks }) {
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
  const [removeHovered, removeIsHovered] = useState(false);
  const [cancelhovered, cancelisHovered] = useState(false);
  const [addHovered, addIsHovered] = useState(false); 
  const [editHovered, editIsHovered] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setShowDatePicker] = useState(false);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

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
    setRecentlyDeletedTasks: PropTypes.func.isRequired,
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
    setShowRemoveAllModal(true);
  };
  
  const confirmRemoveAllTasks = () => {
    setRecentlyDeletedTasks((prevTasks) => [...prevTasks, ...tasks]);
    setTasks([]);
    setShowRemoveAllModal(false);
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
      const selectedTask = isCompletedTask ? completedTasks[index] : tasks[index];
      setEditedTaskContent(selectedTask.name);
      setEditedTask({ name: selectedTask.name, dueDate: selectedTask.dueDate });
      setEditedTaskIndex(index);
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

  const handleEditTask = (index, content) => {
    setEditedTaskIndex(index);
    setEditedTaskContent(content);
    console.log('Editing task:', index, content);
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

  const handleDelete = (index, isCompletedTask) => {
    setShowDeleteModal(true);
    setSelectedTaskIndex(index);
    const taskToDelete = isCompletedTask ? completedTasks[index] : tasks[index];

    if (taskToDelete.important) {
      setImportantTasks((prevImportantTasks) =>
        prevImportantTasks.filter((task) => task.name !== taskToDelete.name)
      );
    }
  };

  const confirmDelete = () => {
    if (selectedTaskIndex !== null) {
      const isCompletedTask = completedTasks.findIndex((task, index) => index === selectedTaskIndex) !== -1;
      if (isCompletedTask) {
        const deletedTask = completedTasks[selectedTaskIndex];
        const updatedCompletedTasks = completedTasks.filter((_, i) => i !== selectedTaskIndex);
        setCompletedTasks(updatedCompletedTasks);
        setRecentlyDeletedTasks(prevTasks => [...prevTasks, { ...deletedTask }]);
      } else {
        const deletedTask = tasks[selectedTaskIndex];
        const updatedTasks = tasks.filter((_, i) => i !== selectedTaskIndex);
        setTasks(updatedTasks);
        setRecentlyDeletedTasks(prevTasks => [...prevTasks, { ...deletedTask }]);
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
            style={{ fontSize: '18px', color: '#5E1B89' }}
          />
          <InputGroup.Text className="bg-transparent mb-3">
            <BsSearch style={{ color: '#5E1B89' }}/>
          </InputGroup.Text>
        </InputGroup>

        <div className="d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-left mb-2 mt-2 roboto-font" style={{ color: '#5E1B89', fontSize: '24px' }}>
            TASKS
          </h1>
          <Dropdown>
            <Dropdown.Toggle variant="transparent" id="tasksDropdown">
              <BsThreeDots style={{ color: '#5E1B89' }} className="fs-5 icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu >
              <Dropdown.Item style={{ color: '#5E1B89' }} onClick={handleSelectAllTasks}>Done All</Dropdown.Item>
              <Dropdown.Item style={{ color: '#5E1B89' }} onClick={handleRemoveAllTasks}>Remove All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Modal style={{ color: '#5E1B89' }} show={showRemoveAllModal} onHide={() => setShowRemoveAllModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Remove All</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove all tasks?
          </Modal.Body>
          <Modal.Footer>
            <Button className="text-white fs-6 border-0" style={{ backgroundColor: cancelhovered ? '#9D71BC' : '#5E1B89', transition: 'background-color 0.3s' }} onClick={() => setShowRemoveAllModal(false)}
             onMouseEnter={() => cancelisHovered(true)}
             onMouseLeave={() => cancelisHovered(false)}>
              Cancel
            </Button>
            <Button className="text-white fs-6 border-0" style={{ backgroundColor: removeHovered ? '#FF7F4D' : '#F4512C', transition: 'background-color 0.3s' }} onClick={confirmRemoveAllTasks}
             onMouseEnter={() => removeIsHovered(true)}
             onMouseLeave={() => removeIsHovered(false)}>
              Remove All
            </Button>
          </Modal.Footer>
        </Modal>

        {/* task form control */}
        <Form onSubmit={handleSubmit} className="bottom-0 mb-3 mt-3">
          <Form.Group controlId="taskInput" className="d-flex align-items-center rounded border bg-light p-2">
            <div className="flex-grow-1 me-2">
              <Form.Control
                type="text"
                placeholder="Add a task"
                value={task}
                onChange={handleChange}
                className="border-0 fs-6"
                style={{ color: '#5E1B89' }} 
              />
            </div>
            <div className="d-flex align-items-center" style={{ color: '#5E1B89' }} >
              <Dropdown drop="up" style={{ color: '#5E1B89' }} >
                <Dropdown.Toggle variant="transparent" id="dueDateDropdown" className="border-0 d-flex dropdown-toggle">
                  <BsCalendar3 style={{ color: '#5E1B89' }}  className="fs-5 icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-menu">
                  <Dropdown.Item style={{ color: '#5E1B89' }}  onClick={() => handleDueDateOption('today')}>Today</Dropdown.Item>
                  <Dropdown.Item style={{ color: '#5E1B89' }}  onClick={() => handleDueDateOption('tomorrow')}>Tomorrow</Dropdown.Item>
                  <Dropdown.Item style={{ color: '#5E1B89' }}  onClick={() => handleDueDateOption('pickDate')}>Pick a Date</Dropdown.Item>
                  <Dropdown.Item style={{ color: '#5E1B89' }}  onClick={() => handleDueDateOption('noDueDate')}>No Due Date</Dropdown.Item>
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
                  style={{ color: '#5E1B89' }} 
                />
              )}
              <Button variant="primary" type="submit" className="border-0" style={{ backgroundColor: addHovered ? '#9D71BC' : '#5E1B89', transition: 'background-color 0.3s' }}
               onMouseEnter={() => addIsHovered(true)}
               onMouseLeave={() => addIsHovered(false)}>
                <BsPlus className="text-white fs-4" />
              </Button>
            </div>
          </Form.Group>
        </Form>

        {(tasks.length === 0 && searchTerm === '') && (
          <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-50">
            <div>
              <p style={{ color: '#5E1B89' }} className="mb-0">No tasks created yet.</p>
            </div>
          </div>
        )}

        {(searchTerm !== '' && filteredTasks.length === 0) && (
          <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-50">
            <div>
              <p style={{ color: '#5E1B89' }} className="mb-0">No task found.</p>
            </div>
          </div>
        )}    

        {filteredTasks.length > 0 && (
          <>
            {/* list of tasks added */}
            <ListGroup>
              {filteredTasks.map((task, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item text-justify" style={{ color: '#5E1B89' }}  onContextMenu={(e) => handleContextMenu(e, index, false)}>
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
                          <Form.Check
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleDone(index)}
                            className="fs-5 me-2 uncomplete-checkbox"
                          />
                          <span
                            className={`align-middle ${task.done ? 'text-decoration-line-through' : ''}`}
                            onClick={() => handleEditTask(index, task.name, task.dueDate)} 
                          >
                            {task.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex col-auto align-items-center justify-content-between">
                      <div className="me-5">
                        <DatePicker
                          selected={task.dueDate}
                          onChange={(date) => handleUpdateTaskDueDate(index, date)}
                          placeholderText={task.dueDate ? format(task.dueDate, 'EEE, dd MMM') : 'No due date'}
                          dateFormat="EEE, dd MMM"
                          wrapperClassName="date-picker-wrapper"
                          className="border-0 rounded border p-2 fs-6 me-5"
                        />
                      </div>
                      <div className="d-flex align-items-center me-3 position-absolute top-50 end-0 translate-middle-y">
                        <Button
                          variant="link"
                          onClick={() => handleToggleImportant(index)}
                          style={{ color: task.important ? '#5E1B89' : '#5E1B89' }}
                        >
                          {task.important ? <BsStarFill /> : <BsStar />}
                        </Button>
                        <Button className="border-0 me-2" style={{ fontSize: '13px', backgroundColor: index === editHovered ? '#9D71BC' : '#5E1B89', }} size="sm" onClick={() => handleEditTask(index, task.name)}  
                            onMouseEnter={() => editIsHovered(index)}
                            onMouseLeave={() => editIsHovered(null)}>
                          Edit
                        </Button>
                        <Button className="border-0" style={{ fontSize: '18px', backgroundColor: index === isHovered ? '#FF7F4D' : '#F4512C', }} size="sm" onClick={() => handleDelete(index)}  
                            onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}>
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

        <Modal style={{ color: '#5E1B89' }} show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this task?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="text-white fs-6 border-0" style={{ backgroundColor:  cancelHovered ? '#9D71BC' : '#5E1B89', transition: 'background-color 0.3s' }} variant="secondary" onClick={() => setShowDeleteModal(false)}
              onMouseEnter={() => cancelIsHovered(true)}
              onMouseLeave={() =>  cancelIsHovered(false)}
            >
              Cancel
            </Button>
            <Button className="text-white fs-6 border-0" style={{ backgroundColor:  deleteHovered ? '#FF7F4D' : '#F4512C', transition: 'background-color 0.3s' }} variant="danger" onClick={confirmDelete}
            onMouseEnter={() => deleteIsHovered(true)}
            onMouseLeave={() =>  deleteIsHovered(false)} 
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* toggle button for completed tasks */}
        <Button
          variant="primary"
          onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          className="mt-3 d-flex align-items-center text-white"
          style={{ fontSize: '13px', backgroundColor: showCompletedTasks ? '#F4512C' : '#5E1B89', border: '#5E1B89'}}
        >
          {showCompletedTasks ? 'Hide Completed Tasks' : 'Show Completed Tasks'}
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
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item text-justify" style={{ color: '#5E1B89' }} >
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleDone(index, true)}
                      className="fs-5 me-2 complete-checkbox"
                    />
                    <span className={`align-middle ${task.done ? 'text-decoration-line-through' : ''}`}>{task.name}</span>
                  </div>
                  <div>
                    {task.dueDate && (
                      <span className="align-middle text-muted fs-6">{format(task.dueDate, 'EEE, dd MMM')}</span>
                    )}
                    <Button variant="link" onClick={() => handleToggleImportant(index, true)} style={{ color: task.important ? '#5E1B89' : '#5E1B89' }}>
                      {task.important ? <BsStarFill /> : <BsStar />}
                    </Button>
                    <Button className="border-0" style={{ fontSize: '18px', backgroundColor: index === completeHovered ? '#FF7F4D' : '#F4512C', transition: 'background-color 0.3s', }} size="sm" onClick={() => handleDelete(index)} 
                        onMouseEnter={() => completeIsHovered(index)}
                        onMouseLeave={() => completeIsHovered(null)}>
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </div>
      {contextMenuVisible && (
        <Dropdown
          className="context-menu"
          style={{ position: 'fixed', top: contextMenuPosition.y, left: contextMenuPosition.x }}
          show={contextMenuVisible}
          onHide={() => setContextMenuVisible(false)}
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleContextMenuAction('delete', selectedTaskIndex, false)} style={{ color: '#F4512C'}}>
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
    </>
  );
}

export default Tasks;
