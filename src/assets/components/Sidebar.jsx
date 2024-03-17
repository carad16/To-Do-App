import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { BsStar, BsTrash, BsPlus } from 'react-icons/bs';
import { FaBriefcase, FaUserAlt } from 'react-icons/fa'
import { Link } from "react-router-dom";

function Sidebar() {
  const [show, setShow] = useState(true);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleClose = () => setShow(false);

  const sidebarStyle = {
    background: 'linear-gradient(180deg, rgba(94,27,137,1) 0%, rgba(157,113,188,1) 29%, rgba(255,127,77,1) 100%), rgb(94, 27, 137)',
    color: 'white',
    width: '250px',
    borderTopRightRadius: '15px',
  };

  const navigation = [
    { name: 'Task', href: '/task', current: true },
    { name: 'Important', href: '/important', current: false },
    { name: 'Recently Deleted', href: '/recentlydeleted', current: false },
    { name: 'Work', href: '/work', current: false },
    { name: 'Personal', href: '/personal', current: false },
  ]

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName.trim()
      };
      const newCategoryIndex = categories.findIndex(category => category.id === 'new');
      const updatedCategories = [...categories.slice(0, newCategoryIndex), newCategory, ...categories.slice(newCategoryIndex)];
      setCategories(updatedCategories);
      setNewCategoryName('');
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleCategoryNameChange = (id, newName) => {
    setCategories(categories.map(category => category.id === id ? { ...category, name: newName } : category));
  };

  return (
    <Offcanvas show={show} onHide={handleClose} className="sidebar-offcanvas" backdrop={false} style={sidebarStyle}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="text-white fw-bolder">To-Do App</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="fw-bold">
          <SidebarMenu.Nav.Title>
            All to-dos
          </SidebarMenu.Nav.Title>
        </div>
        <hr className="bg-light mb-1 mt-2 text-left" />
        <div className="d-grid gap-1">
          <Link to="/task" className="hover-link p-2" variant="primary mb-2" size="sm">
            <div className="d-flex align-items-center">
              <BsStar className="me-2"/> 
              Tasks
            </div>
          </Link>
          <Link to="/important" className="hover-link p-2" variant="primary mb-2" size="sm">
            <div className="d-flex align-items-center">
              <BsStar className="me-2"/> 
              Important 
            </div>
          </Link>
          <Link to="/recentlydeleted" className="hover-link p-2" variant="secondary mb-2" size="sm">
            <div className="d-flex align-items-center">
              <BsTrash className="me-2"/> 
              Recently Deleted 
            </div>
          </Link>
        </div>
        <div className="mt-3 fw-bold">
          <SidebarMenu.Nav.Title>
            Categories
          </SidebarMenu.Nav.Title>
        </div>
        <hr className="bg-light mb-1 mt-2 text-left" />
        <div className="d-grid gap-1">
          {categories.map(category => (
            <Link key={category.id} className="hover-link p-2" variant="primary mb-2" size="sm">
              <div className="d-flex align-items-center">
                {category.id === 'new' ? (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="form-control"
                    />
                   <Button
                      variant="warning"
                      className="ms-2"
                      onClick={handleAddCategory}
                      style={{
                        backgroundColor: isHovered ? '#9D71BC' : '#5E1B89',
                        borderColor: isHovered ? '#9D71BC' : '#5E1B89'
                      }}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      <span className="text-white">Save</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <div>{category.name}</div>
                  </>
                )}
              </div>
            </Link>
          ))}
          <Link className="hover-link p-2" variant="primary mb-2" size="sm">
            <div className="d-flex align-items-center">
              <BsPlus className="me-1" size={24}/>
              <div onClick={() => setCategories([...categories, { id: 'new', name: '' }])}>Add New Category</div>
            </div>
          </Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidebar;
