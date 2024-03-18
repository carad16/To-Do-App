import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

function Important() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() !== '') {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Container>
      <Row className="mt-2">
        <Col md={{ span: 6, offset: 3 }} className="text-left">
        <h1 className="mb-4 text-left #5E1B89">To-Do List</h1>
          <Form className="d-flex mt-2" onSubmit={handleSubmit}>
            <Form.Group controlId="taskInput">
              <Form.Control
                type="text"
                placeholder="Enter task"
                value={task}
                onChange={handleChange}
              />
            </Form.Group>
            <Button className="ms-2" variant="primary" type="submit">
              Add Task
            </Button>
          </Form>
          <ListGroup className="mt-3">
            {tasks.map((task, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {task}
                <Button variant="danger" size="sm" onClick={() => handleDelete(index)}>Delete</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Important;
