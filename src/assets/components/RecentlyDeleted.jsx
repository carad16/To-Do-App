import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { ListGroup, InputGroup, Form, Dropdown, Modal, Button} from 'react-bootstrap';
import { BsSearch, BsThreeDots } from 'react-icons/bs';

function RecentlyDeleted({ recentlyDeletedTasks, setRecentlyDeletedTasks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [taskToRestore, setTaskToRestore] = useState(null);
  const [restoreHovered, restoreIsHovered] = useState(false); 
  const [cancelHovered, cancelIsHovered] = useState(false);
  const [restorehovered, restoreisHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('recentlyDeletedTasks', JSON.stringify(recentlyDeletedTasks));
  }, [recentlyDeletedTasks]);

  const handleClearAll = () => {
    localStorage.removeItem('recentlyDeletedTasks');
    //console.log('Local storage cleared');
    setRecentlyDeletedTasks([]);
  };

  const handleRestoreTask = (task, index) => {
    setShowRestoreModal(true);
    setTaskToRestore({ task, index });
  };
  
  const confirmRestoreTask = () => {
    const { task, index } = taskToRestore;
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = [...tasks, task];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
    const updatedRecentlyDeletedTasks = [...recentlyDeletedTasks];
    updatedRecentlyDeletedTasks.splice(index, 1);
    setRecentlyDeletedTasks(updatedRecentlyDeletedTasks);
  
    localStorage.setItem('recentlyDeletedTasks', JSON.stringify(updatedRecentlyDeletedTasks));
  
    setShowRestoreModal(false);
  };
  
  RecentlyDeleted.propTypes = {
    recentlyDeletedTasks: PropTypes.array.isRequired,
    setRecentlyDeletedTasks: PropTypes.array.isRequired,
    restoreTask: PropTypes.func.isRequired,
  };

  const filteredTasks = recentlyDeletedTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* search bar */}
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-1"
            style={{ fontSize: '18px', color: '#5E1B89' }}
          />
          <InputGroup.Text className="bg-transparent">
            <BsSearch style={{ color: '#5E1B89' }}/>
          </InputGroup.Text>
        </InputGroup>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <h1 className="fw-bold text-left mb-2 mt-2 roboto-font" style={{ color: '#5E1B89', fontSize: '24px' }}>
            RECENTLY DELETED TASKS
        </h1>
        <Dropdown>
        <Dropdown.Toggle variant="transparent" id="tasksDropdown">
            <BsThreeDots style={{ color: '#5E1B89' }} className="fs-5 icon" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item style={{ color: '#5E1B89' }} onClick={handleClearAll}>Clear All</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
      </div>
    
      {(searchTerm !== '' && filteredTasks.length === 0) && (
        <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
          <div>
            <p style={{ color: '#5E1B89' }} className="mb-0">No task found.</p>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 && searchTerm === '' && (
        <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
          <div>
            <p style={{ color: '#5E1B89' }} className="mb-0">No recently deleted tasks.</p>
          </div>
        </div>
      )}
      {filteredTasks.length > 0 && (
        <ListGroup>
          {filteredTasks.map((task, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item text-justify" style={{ color: '#5E1B89' }} >
              <div className="d-flex align-items-center">
                <span>{task.name}</span>
              </div>
              <div>
              {task.dueDate && (
                <span className="align-middle ms-3 me-3 text-muted">{format(task.dueDate, 'EEE, dd MMM')}</span>
              )}
              <button className="border-0 rounded border p-2" style={{ fontSize: '12px', color: 'white', backgroundColor: restoreHovered ? '#FF7F4D' : '#F4512C', transition: 'background-color 0.3s' }} onClick={() => handleRestoreTask(task)}
                  onMouseEnter={() => restoreIsHovered(true)}
                  onMouseLeave={() => restoreIsHovered(false)}>
                Restore
              </button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal style={{ color: '#5E1B89' }} show={showRestoreModal} onHide={() => setShowRestoreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Restore</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to restore this task?
        </Modal.Body>
        <Modal.Footer>
        <Button
              className="text-white fs-6 border-0" style={{ backgroundColor:  cancelHovered ? '#9D71BC' : '#5E1B89', transition: 'background-color 0.3s' }} variant="secondary" onClick={() => setShowRestoreModal(false)}
              onMouseEnter={() => cancelIsHovered(true)}
              onMouseLeave={() =>  cancelIsHovered(false)}
            >
              Cancel
            </Button>
            <Button className="text-white fs-6 border-0" style={{ backgroundColor:  restorehovered ? '#FF7F4D' : '#F4512C', transition: 'background-color 0.3s' }} variant="danger" onClick={confirmRestoreTask}
              onMouseEnter={() => restoreisHovered(true)}
              onMouseLeave={() =>  restoreisHovered(false)} 
            >
              Restore
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecentlyDeleted;
