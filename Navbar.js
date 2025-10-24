// src/components/NavigationBar.jsx
import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

const NavigationBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      lecturer: 'Lecturer',
      prl: 'Principal Lecturer',
      pl: 'Program Leader'
    }
    return roleMap[role] || role
  }

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className="shadow-sm"
      style={{ minHeight: '60px' }} // Reduced height
    >
      <Container fluid> {/* Changed to fluid for better spacing */}
        {/* ✅ Compact Logo + System Name */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center py-1">
          <img
            src={logo}
            alt="LUCT Logo"
            style={{
              width: '35px', // Reduced from 50px
              height: '35px', // Reduced from 50px
              borderRadius: '6px',
              objectFit: 'cover',
              marginRight: '8px' // Reduced spacing
            }}
          />
          <span className="fw-bold text-uppercase" style={{ fontSize: '0.9rem' }}>
            LUCT Reporting System
          </span>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="py-1" // Reduced toggle button size
        />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className="py-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className="py-2">Dashboard</Nav.Link>

                {user.role === 'lecturer' && (
                  <Nav.Link as={Link} to="/report" className="py-2">Submit Report</Nav.Link>
                )}

                {(user.role === 'lecturer' || user.role === 'prl' || user.role === 'pl') && (
                  <>
                    <Nav.Link as={Link} to="/reports" className="py-2">View Reports</Nav.Link>
                    <Nav.Link as={Link} to="/classes" className="py-2">Classes</Nav.Link>
                  </>
                )}

                {(user.role === 'prl' || user.role === 'pl') && (
                  <Nav.Link as={Link} to="/courses" className="py-2">Courses</Nav.Link>
                )}

                <Nav.Link as={Link} to="/monitoring" className="py-2">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/rating" className="py-2">Rating</Nav.Link>
              </Nav>

              <Nav>
                <NavDropdown
                  title={`${user.name} (${getRoleDisplayName(user.role)})`}
                  id="user-dropdown"
                  align="end"
                  className="py-2"
                >
                  <NavDropdown.Item as={Link} to="/dashboard">
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/">
                    Home
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="py-2">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="py-2">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="py-2">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar