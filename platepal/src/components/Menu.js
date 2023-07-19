import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Nav, Modal, Button } from "react-bootstrap";

function Menu({ isOpen, toggleMenu }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Check for token changes when router location changes.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleShowConfirmLogout = () => {
    setShowConfirmLogout(true);
  };

  const handleCloseConfirmLogout = () => {
    setShowConfirmLogout(false);
  };

  const handleLogout = () => {
    setShowConfirmLogout(false);
    navigate("/logout");
  };

  function isTokenExpired(token) {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 < Date.now();
  }

  return (
    <>
      <Nav className="me-auto fs-5">
        <Nav.Link as={Link} to="/" onClick={toggleMenu}>
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/recipes" onClick={toggleMenu}>
          Recipes
        </Nav.Link>

        {isLoggedIn ? (
          <>
            <Nav.Link as={Link} to="/profile" onClick={toggleMenu}>
              My Profile
            </Nav.Link>
            <Nav.Link onClick={handleShowConfirmLogout}>Logout</Nav.Link>
          </>
        ) : (
          <Nav.Link as={Link} to="/login" onClick={toggleMenu}>
            Login
          </Nav.Link>
        )}
      </Nav>
      <Modal show={showConfirmLogout} onHide={handleCloseConfirmLogout}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmLogout}>
            Cancel
          </Button>
          <Button
            className="platepal-button-primary"
            variant="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Menu;
