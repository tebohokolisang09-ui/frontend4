import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import limkokwingImage from '../assets/limkokwing.jpeg'; // ✅ Background image

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '📊',
      title: 'Academic Reporting',
      description: 'Streamlined reporting system for lecturers to submit detailed class reports and track academic progress.'
    },
    {
      icon: '👨‍🏫',
      title: 'Lecturer Management',
      description: 'Comprehensive tools for lecturers to manage classes, submit reports, and monitor student attendance.'
    },
    {
      icon: '🎓',
      title: 'Student Portal',
      description: 'Students can monitor their progress, view class reports, and provide valuable feedback through ratings.'
    },
    {
      icon: '📈',
      title: 'Performance Analytics',
      description: 'Real-time monitoring and analytics for principal lecturers and program leaders to track academic performance.'
    },
    {
      icon: '⭐',
      title: 'Rating System',
      description: 'Comprehensive rating and feedback system to maintain and improve educational quality.'
    },
    {
      icon: '🏫',
      title: 'Course Management',
      description: 'Program leaders can manage courses, assign modules, and oversee the entire academic program.'
    }
  ];

  const roles = [
    {
      role: 'student',
      icon: '👨‍🎓',
      title: 'Students',
      description: 'Track your academic journey and provide feedback'
    },
    {
      role: 'lecturer',
      icon: '👨‍🏫',
      title: 'Lecturers',
      description: 'Submit reports and manage your classes efficiently'
    },
    {
      role: 'prl',
      icon: '👨‍💼',
      title: 'Principal Lecturers',
      description: 'Oversee academic streams and provide guidance'
    },
    {
      role: 'pl',
      icon: '👨‍💻',
      title: 'Program Leaders',
      description: 'Manage programs and ensure academic excellence'
    }
  ];

  return (
    <div className="welcome-page">

      {/* ✅ Hero Section with Full Background Image */}
      <section
        className="hero-section text-white"
        style={{
          backgroundImage: `url(${limkokwingImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Dark overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1
          }}
        ></div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <div className="hero-content text-center text-lg-start">
                <img
                  src={limkokwingImage}
                  alt="Limkokwing University"
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '15px',
                    border: '5px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    backgroundColor: 'white',
                    padding: '12px',
                    marginBottom: '30px'
                  }}
                />
                <h1 className="display-3 fw-bold mb-3 text-uppercase">
                  LIMKOKWING
                </h1>
                <h2 className="h1 mb-4 text-warning fw-bold">
                  UNIVERSITY OF CHAMPIONSTICS
                </h2>
                <h3 className="h2 mb-4 fw-light">
                  Academic Reporting System
                </h3>
                <p className="lead mb-4 fs-5">
                  Welcome to our comprehensive academic management platform designed to streamline 
                  reporting, monitoring, and communication across the university community.
                </p>

                {!user ? (
                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <Button
                      as={Link}
                      to="/login"
                      variant="warning"
                      size="lg"
                      className="fw-bold px-5 py-3"
                    >
                      🚀 Sign In to System
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      variant="outline-light"
                      size="lg"
                      className="px-5 py-3"
                    >
                      📝 Create Account
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <Button
                      as={Link}
                      to="/dashboard"
                      variant="warning"
                      size="lg"
                      className="fw-bold px-5 py-3"
                    >
                      📊 Go to Dashboard
                    </Button>
                    <Button
                      as={Link}
                      to="/"
                      variant="outline-light"
                      size="lg"
                      className="px-5 py-3"
                    >
                      🔍 Explore Features
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-4 fw-bold text-primary mb-3">System Features</h2>
              <p className="lead text-muted fs-4">Comprehensive tools for academic excellence</p>
            </Col>
          </Row>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm feature-card">
                  <Card.Body className="text-center p-5">
                    <div className="feature-icon mb-4">
                      <div
                        className="icon-container bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '90px',
                          height: '90px',
                          background: 'linear-gradient(135deg, #3498db, #2c3e50)'
                        }}
                      >
                        <span className="text-white fs-1">{feature.icon}</span>
                      </div>
                    </div>
                    <Card.Title className="h4 mb-3 text-primary fw-bold">
                      {feature.title}
                    </Card.Title>
                    <Card.Text className="text-muted fs-6 lh-base">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <img
                  src={limkokwingImage}
                  alt="Limkokwing University"
                  style={{
                    width: '50px',
                    height: 'auto',
                    borderRadius: '8px',
                    marginRight: '15px',
                    border: '3px solid rgba(255,255,255,0.2)',
                    padding: '4px',
                    backgroundColor: 'white'
                  }}
                />
                <div>
                  <h5 className="mb-0 fw-bold">LIMKOKWING UNIVERSITY</h5>
                  <small className="text-muted">OF CHAMPIONSTICS</small>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <small className="text-muted">
                © 2024 LUCT Reporting System · Empowering Education Excellence
              </small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
