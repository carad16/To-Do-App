import React from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroup } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';

function Important({ importantTasks }) {
  Important.propTypes = {
    importantTasks: PropTypes.array.isRequired,
  };

  return (
    <div className="container mt-2">
      <h1 className="fw-bold text-left mb-2 mt-2" style={{ color: '#5E1B89', fontSize: '28px' }}>
        Important Tasks
      </h1>
      {importantTasks.length === 0 && (
        <div className="notebook-design border rounded p-3 d-flex align-items-center justify-content-center min-vh-100">
          <div>
            <p className="mb-0">No important tasks.</p>
          </div>
        </div>
      )}
      {importantTasks.length > 0 && (
        <ListGroup>
          {importantTasks.map((task, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center task-item">
              <div className="d-flex align-items-center">
                <span>{task.name}</span>
              </div>
              <div>
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
