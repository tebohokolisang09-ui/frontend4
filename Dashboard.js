import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css'; // ✅ CSS file for background and styling

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'Monitor your classes and provide ratings.',
          features: ['View Class Reports', 'Monitor Progress', 'Rate Lectures']
        };
      case 'lecturer':
        return {
          title: 'Lecturer Dashboard',
          description: 'Manage your classes and submit reports.',
          features: ['Submit Reports', 'View Classes', 'Monitor Students', 'View Ratings']
        };
      case 'prl':
        return {
          title: 'Principal Lecturer Dashboard',
          description: 'Oversee courses and provide feedback on reports.',
          features: ['View All Courses', 'Review Reports', 'Provide Feedback', 'Monitor Classes']
        };
      case 'pl':
        return {
          title: 'Program Leader Dashboard',
          description: 'Manage program structure and assignments.',
          features: ['Manage Courses', 'Assign Modules', 'View Reports', 'Oversee Program']
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to LUCT Reporting System',
          features: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <Container fluid className="py-4 dashboard-container">
      <Row>
        <Col>
          <div className="text-center mb-5 text-white">
            <h1 className="display-4 mb-3">{content.title}</h1>
            <p className="lead">{content.description}</p>
            <p>
              Welcome back, <strong>{user.name}</strong>!
            </p>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {content.features.map((feature, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="h-100 shadow-lg bg-light bg-opacity-75 border-0 rounded-4">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle p-2 me-3">
                    <span className="text-white">✓</span>
                  </div>
                  <Card.Title className="mb-0">{feature}</Card.Title>
                </div>
                <Card.Text className="flex-grow-1 text-muted">
                  Access this feature through the navigation menu to manage your academic activities.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="bg-light bg-opacity-75 border-0 rounded-4 shadow-lg">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 text-primary">Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h3 className="text-primary">0</h3>
                  <p className="text-muted">Total Reports</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-success">0</h3>
                  <p className="text-muted">Active Classes</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-info">0</h3>
                  <p className="text-muted">Pending Tasks</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-warning">0</h3>
                  <p className="text-muted">Notifications</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
