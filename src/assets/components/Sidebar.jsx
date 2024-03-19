import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import Button from 'react-bootstrap/Button';
import { BsStar, BsTrash, BsPlus, BsHouseDoor } from 'react-icons/bs';
import { Link } from "react-router-dom";
import logo from '/lexmeet_white.png';

function Sidebar({ taskCount }) {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const sidebarStyle = {
    background: 'linear-gradient(180deg, rgba(94,27,137,1) 0%, rgba(157,113,188,1) 29%, rgba(255,127,77,1) 100%), rgb(94, 27, 137)',
    color: 'white',
    width: '250px',
    borderTopRightRadius: '15px',
  };

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

  return (
    <div className="sidebar-offcanvas p-3" style={sidebarStyle}>
      <Offcanvas.Header className="d-flex justify-content-center align-items-center mb-3">
        <img src={logo} alt="LexMeet" className="img-fluid" style={{ maxWidth: '170px', maxHeight: '95px' }} />
      </Offcanvas.Header>
      <div>
        <div className=" text-left roboto-font">
          <SidebarMenu.Nav.Title>
            ALL TO DOS
          </SidebarMenu.Nav.Title>
        </div>
        <hr className="bg-light mb-1 mt-2 text-left" />
        <div className="d-grid gap-1">
          <Link to="/tasks" className="hover-link p-2" variant="primary mb-2" size="sm">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsHouseDoor className="me-2"/> 
                Tasks
              </div>
              <div className="text-white" style={{ fontSize: '11px' }}>{taskCount}</div>
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
      </div>
    </div>
  );
}

export default Sidebar;
