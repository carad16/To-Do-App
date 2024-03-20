import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, ListGroup, InputGroup, Form } from 'react-bootstrap';
import { BsStarFill, BsStar, BsSearch } from 'react-icons/bs';

function Important({ importantTasks }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('importantTasks', JSON.stringify(importantTasks));
  }, [importantTasks]);

  Important.propTypes = {
    importantTasks: PropTypes.array.isRequired,
  };

  const filteredTasks = importantTasks.filter((task) =>
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
            <BsSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>

      <h1 className="fw-bold text-left mb-2 mt-2 roboto-font" style={{ color: '#5E1B89', fontSize: '24px' }}>
        IMPORTANT TASKS
      </h1>

      {(searchTerm !== '' && filteredTasks.length === 0) && (
        <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
          <div>
            <p className="mb-0">No task found.</p>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 && searchTerm === '' && (
        <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
          <div>
            <p className="mb-0">No important tasks.</p>
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
                <span className="align-middle ms-3 text-muted">{format(task.dueDate, 'EEE, dd MMM')}</span>
              )}
              <Button variant="link" style={{ color: '#ffc107' }}>
                {task.important ? <BsStarFill /> : <BsStar />}
              </Button>
            </div>
          </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default Important;
