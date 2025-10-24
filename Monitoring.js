import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Form, ProgressBar, Badge, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const Monitoring = () => {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({})
  const [timeframe, setTimeframe] = useState('week')
  const [loading, setLoading] = useState(true)

  const mockMetrics = {
    overall: {
      attendance: 85,
      completion: 78,
      satisfaction: 4.2,
      reportsSubmitted: 45
    },
    byCourse: [
      { course: 'Web Design', attendance: 88, completion: 82, reports: 12 },
      { course: 'Database Systems', attendance: 83, completion: 75, reports: 10 },
      { course: 'Software Engineering', attendance: 81, completion: 76, reports: 8 },
      { course: 'Mobile Development', attendance: 87, completion: 80, reports: 9 }
    ],
    recentActivity: [
      { action: 'Report Submitted', user: 'Dr. John Smith', course: 'Web Design', time: '2 hours ago' },
      { action: 'Feedback Added', user: 'Principal Lecturer', course: 'Database Systems', time: '4 hours ago' },
      { action: 'Class Updated', user: 'Program Leader', course: 'Software Engineering', time: '1 day ago' },
      { action: 'Rating Added', user: 'Student', course: 'Mobile Development', time: '1 day ago' }
    ]
  }

  useEffect(() => {
    // Simulate API call with loading state
    setLoading(true)
    setTimeout(() => {
      setMetrics(mockMetrics)
      setLoading(false)
    }, 1000)
  }, [timeframe])

  const getVariant = (value) => {
    if (value >= 80) return 'success'
    if (value >= 70) return 'warning'
    return 'danger'
  }

  const getStatusVariant = (attendance) => {
    return attendance >= 80 ? 'success' : 'warning'
  }

  const getStatusText = (attendance) => {
    return attendance >= 80 ? 'Good' : 'Needs Attention'
  }

  // Safe access to user properties
  const canViewDetailedAnalytics = user && (user.role === 'prl' || user.role === 'pl')

  // Show loading state
  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Alert variant="info">
            Loading monitoring data...
          </Alert>
        </div>
      </Container>
    )
  }

  // Show error if user is not logged in
  if (!user) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Alert variant="warning">
            Please log in to access monitoring data.
          </Alert>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">System Monitoring</h4>
              <Form.Select 
                style={{ width: 'auto' }} 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
              </Form.Select>
            </Card.Header>
            <Card.Body>
              {/* Overall Metrics */}
              <Row className="mb-5">
                <Col md={3} className="text-center mb-3">
                  <Card className="border-0 bg-light stats-card">
                    <Card.Body className="p-3">
                      <h1 className="text-primary mb-2">{metrics.overall?.attendance || 0}%</h1>
                      <p className="text-muted mb-0">Average Attendance</p>
                      <Badge bg={getVariant(metrics.overall?.attendance || 0)} className="mt-2">
                        {getStatusText(metrics.overall?.attendance || 0)}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="border-0 bg-light stats-card">
                    <Card.Body className="p-3">
                      <h1 className="text-success mb-2">{metrics.overall?.completion || 0}%</h1>
                      <p className="text-muted mb-0">Course Completion</p>
                      <Badge bg={getVariant(metrics.overall?.completion || 0)} className="mt-2">
                        {getStatusText(metrics.overall?.completion || 0)}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="border-0 bg-light stats-card">
                    <Card.Body className="p-3">
                      <h1 className="text-info mb-2">{metrics.overall?.satisfaction || 0}/5</h1>
                      <p className="text-muted mb-0">Satisfaction Rate</p>
                      <Badge bg={getVariant((metrics.overall?.satisfaction || 0) * 20)} className="mt-2">
                        {getStatusText((metrics.overall?.satisfaction || 0) * 20)}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="border-0 bg-light stats-card">
                    <Card.Body className="p-3">
                      <h1 className="text-warning mb-2">{metrics.overall?.reportsSubmitted || 0}</h1>
                      <p className="text-muted mb-0">Reports Submitted</p>
                      <Badge bg="info" className="mt-2">
                        This {timeframe}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Course-wise Metrics */}
              <Row className="mb-4">
                <Col md={8}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Course Performance</h5>
                    </Card.Header>
                    <Card.Body>
                      {metrics.byCourse && metrics.byCourse.length > 0 ? (
                        <Table responsive striped hover>
                          <thead>
                            <tr>
                              <th>Course</th>
                              <th>Attendance</th>
                              <th>Completion</th>
                              <th>Reports</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics.byCourse.map((course, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{course.course}</strong>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 me-3">
                                      <ProgressBar 
                                        variant={getVariant(course.attendance)}
                                        now={course.attendance} 
                                        label={`${course.attendance}%`}
                                        style={{ minWidth: '100px' }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 me-3">
                                      <ProgressBar 
                                        variant={getVariant(course.completion)}
                                        now={course.completion} 
                                        label={`${course.completion}%`}
                                        style={{ minWidth: '100px' }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <Badge bg="info" className="fs-6">
                                    {course.reports}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge bg={getStatusVariant(course.attendance)}>
                                    {getStatusText(course.attendance)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <Alert variant="info" className="text-center">
                          No course data available.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={4}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Recent Activity</h5>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {metrics.recentActivity && metrics.recentActivity.length > 0 ? (
                        metrics.recentActivity.map((activity, index) => (
                          <div key={index} className="border-start border-3 border-primary ps-3 mb-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <strong className="text-primary">{activity.action}</strong>
                              <small className="text-muted">{activity.time}</small>
                            </div>
                            <p className="mb-1 small text-dark">{activity.user}</p>
                            <p className="mb-0 small text-muted">{activity.course}</p>
                          </div>
                        ))
                      ) : (
                        <Alert variant="info" className="text-center">
                          No recent activity.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Role-specific monitoring */}
              {canViewDetailedAnalytics && (
                <Row className="mt-4">
                  <Col>
                    <Card>
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Detailed Analytics</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <div className="p-3 border rounded">
                              <h6 className="text-primary mb-3">
                                <i className="bi bi-person-badge me-2"></i>
                                Lecturer Performance
                              </h6>
                              <p className="text-muted mb-3">
                                {user.role === 'pl' 
                                  ? 'Program-wide lecturer performance metrics and trends across all courses and streams.'
                                  : 'Stream-specific lecturer monitoring, feedback analysis, and performance tracking.'
                                }
                              </p>
                              <div className="row text-center small">
                                <div className="col-4">
                                  <div className="text-success fw-bold">4.3/5</div>
                                  <div>Avg. Rating</div>
                                </div>
                                <div className="col-4">
                                  <div className="text-primary fw-bold">92%</div>
                                  <div>On Time</div>
                                </div>
                                <div className="col-4">
                                  <div className="text-info fw-bold">15</div>
                                  <div>Reports</div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="p-3 border rounded">
                              <h6 className="text-success mb-3">
                                <i className="bi bi-graph-up me-2"></i>
                                Student Progress
                              </h6>
                              <p className="text-muted mb-3">
                                {user.role === 'pl'
                                  ? 'Overall student performance, engagement metrics, and academic progress across all programs.'
                                  : 'Student progress tracking, attendance patterns, and academic performance within your stream.'
                                }
                              </p>
                              <div className="row text-center small">
                                <div className="col-4">
                                  <div className="text-warning fw-bold">85%</div>
                                  <div>Attendance</div>
                                </div>
                                <div className="col-4">
                                  <div className="text-success fw-bold">78%</div>
                                  <div>Completion</div>
                                </div>
                                <div className="col-4">
                                  <div className="text-info fw-bold">4.1/5</div>
                                  <div>Satisfaction</div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        
                        {/* Additional analytics for PL */}
                        {user.role === 'pl' && (
                          <Row className="mt-4">
                            <Col md={4}>
                              <div className="text-center p-3 border rounded">
                                <h6 className="text-primary">Program Health</h6>
                                <ProgressBar 
                                  variant="success" 
                                  now={88} 
                                  label="88%" 
                                  className="mb-2"
                                />
                                <small className="text-muted">Overall program performance</small>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="text-center p-3 border rounded">
                                <h6 className="text-warning">Resource Utilization</h6>
                                <ProgressBar 
                                  variant="warning" 
                                  now={72} 
                                  label="72%" 
                                  className="mb-2"
                                />
                                <small className="text-muted">Classroom & lab usage</small>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="text-center p-3 border rounded">
                                <h6 className="text-info">Staff Engagement</h6>
                                <ProgressBar 
                                  variant="info" 
                                  now={95} 
                                  label="95%" 
                                  className="mb-2"
                                />
                                <small className="text-muted">Lecturer participation</small>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Student-specific view */}
              {user.role === 'student' && (
                <Row className="mt-4">
                  <Col>
                    <Card>
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">My Progress Overview</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <h6>Current Performance</h6>
                            <p className="text-muted">
                              Track your academic progress, attendance, and course completion rates.
                            </p>
                            <div className="row text-center">
                              <div className="col-4">
                                <div className="text-primary fw-bold">88%</div>
                                <small>Your Attendance</small>
                              </div>
                              <div className="col-4">
                                <div className="text-success fw-bold">75%</div>
                                <small>Course Progress</small>
                              </div>
                              <div className="col-4">
                                <div className="text-warning fw-bold">4.2/5</div>
                                <small>Avg. Grade</small>
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <h6>Recommendations</h6>
                            <p className="text-muted">
                              Based on your current performance, we recommend:
                            </p>
                            <ul className="small">
                              <li>Focus on completing pending assignments</li>
                              <li>Attend all scheduled classes</li>
                              <li>Participate in course discussions</li>
                            </ul>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Monitoring