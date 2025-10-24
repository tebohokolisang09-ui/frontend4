import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Form, Badge, Modal, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const ReportsView = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  // States for creating a new report
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newReport, setNewReport] = useState({
    facultyName: '',
    className: '',
    weekOfReporting: '',
    dateOfLecture: '',
    courseName: '',
    courseCode: '',
    actualStudentsPresent: '',
    totalRegisteredStudents: '',
    venue: '',
    scheduledTime: '',
    topicTaught: '',
    learningOutcomes: '',
    recommendations: ''
  })

  // Mock data
  const mockReports = [
    {
      id: 1,
      facultyName: 'Faculty of ICT',
      className: 'SE101',
      weekOfReporting: 'Week 6',
      dateOfLecture: '2024-03-15',
      courseName: 'Web Design',
      courseCode: 'BIWD2110',
      lecturerName: 'Dr. John Smith',
      actualStudentsPresent: 45,
      totalRegisteredStudents: 50,
      venue: 'Room 101',
      scheduledTime: '10:00',
      topicTaught: 'React Fundamentals and Component Architecture',
      learningOutcomes: 'Students can create functional components and understand state management',
      recommendations: 'More practical examples needed for state hooks',
      status: 'submitted',
      feedback: ''
    },
    {
      id: 2,
      facultyName: 'Faculty of ICT',
      className: 'SE102',
      weekOfReporting: 'Week 6',
      dateOfLecture: '2024-03-16',
      courseName: 'Database Systems',
      courseCode: 'BIDS2111',
      lecturerName: 'Prof. Sarah Johnson',
      actualStudentsPresent: 38,
      totalRegisteredStudents: 42,
      venue: 'Lab 201',
      scheduledTime: '14:00',
      topicTaught: 'SQL Queries and Database Normalization',
      learningOutcomes: 'Students can write complex SQL queries and understand normalization forms',
      recommendations: 'Provide more exercises on JOIN operations',
      status: 'reviewed',
      feedback: 'Good coverage of normalization concepts'
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      let userReports = mockReports
      if (user && user.role === 'lecturer') {
        userReports = mockReports.filter(report => report.lecturerName === user.name)
      }
      setReports(userReports)
      setFilteredReports(userReports)
      setLoading(false)
    }, 500)
  }, [user])

  useEffect(() => {
    if (reports.length > 0) {
      const filtered = reports.filter(report =>
        report.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.className.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredReports(filtered)
    }
  }, [searchTerm, reports])

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setFeedback('')
    setShowModal(true)
  }

  const handleSubmitFeedback = () => {
    if (user && user.role === 'prl' && selectedReport) {
      const updatedReports = reports.map(report =>
        report.id === selectedReport.id
          ? { ...report, feedback, status: 'reviewed' }
          : report
      )
      setReports(updatedReports)
      setFilteredReports(updatedReports)
      setShowModal(false)
      setFeedback('')
      setSelectedReport(null)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedReport(null)
    setFeedback('')
  }

  const handleCreateReport = () => {
    const newEntry = {
      id: reports.length + 1,
      ...newReport,
      lecturerName: user.name,
      status: 'submitted',
      feedback: ''
    }
    setReports([...reports, newEntry])
    setFilteredReports([...reports, newEntry])
    setNewReport({
      facultyName: '',
      className: '',
      weekOfReporting: '',
      dateOfLecture: '',
      courseName: '',
      courseCode: '',
      actualStudentsPresent: '',
      totalRegisteredStudents: '',
      venue: '',
      scheduledTime: '',
      topicTaught: '',
      learningOutcomes: '',
      recommendations: ''
    })
    setShowCreateModal(false)
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'submitted': return 'warning'
      case 'reviewed': return 'success'
      case 'approved': return 'info'
      default: return 'secondary'
    }
  }

  const canAddFeedback = user && user.role === 'prl'
  const canViewAll = user && (user.role === 'pl' || user.role === 'prl')
  const isLecturer = user && user.role === 'lecturer'
  const hasSelectedReport = selectedReport !== null
  const selectedReportHasFeedback = selectedReport && selectedReport.feedback

  if (loading) return <Alert variant="info" className="m-4 text-center">Loading reports...</Alert>
  if (!user) return <Alert variant="warning" className="m-4 text-center">Please log in to view reports.</Alert>

  const getPageTitle = () => {
    switch (user.role) {
      case 'lecturer': return 'My Reports'
      case 'prl': return 'Reports for Review'
      case 'pl': return 'All Program Reports'
      default: return 'Reports'
    }
  }

  return (
    <Container className="py-4" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{getPageTitle()}</h4>
              <div className="d-flex align-items-center gap-3">
                {/* "Submit Report" button removed */}
                {isLecturer && (
                  <Button variant="light" onClick={() => setShowCreateModal(true)}>
                    ➕ New Report
                  </Button>
                )}
                <Badge bg="light" text="dark" className="fs-6">
                  {filteredReports.length} reports
                </Badge>
              </div>
            </Card.Header>

            <Card.Body>
              {/* Search Bar */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
              </Row>

              {/* Reports Table */}
              {filteredReports.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      {canViewAll && <th>Lecturer</th>}
                      <th>Date</th>
                      <th>Attendance</th>
                      <th>Status</th>
                      <th>Feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map(report => (
                      <tr key={report.id}>
                        <td>{report.courseName}</td>
                        <td>{report.className}</td>
                        {canViewAll && <td>{report.lecturerName}</td>}
                        <td>{report.dateOfLecture}</td>
                        <td>{report.actualStudentsPresent}/{report.totalRegisteredStudents}</td>
                        <td><Badge bg={getStatusVariant(report.status)}>{report.status}</Badge></td>
                        <td>{report.feedback ? '✅' : '⏳'}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="text-center">No reports available.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Report Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}><Form.Control placeholder="Faculty Name" value={newReport.facultyName} onChange={e => setNewReport({ ...newReport, facultyName: e.target.value })} /></Col>
              <Col md={6}><Form.Control placeholder="Class Name" value={newReport.className} onChange={e => setNewReport({ ...newReport, className: e.target.value })} /></Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><Form.Control placeholder="Course Name" value={newReport.courseName} onChange={e => setNewReport({ ...newReport, courseName: e.target.value })} /></Col>
              <Col md={6}><Form.Control placeholder="Course Code" value={newReport.courseCode} onChange={e => setNewReport({ ...newReport, courseCode: e.target.value })} /></Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}><Form.Control placeholder="Week of Reporting" value={newReport.weekOfReporting} onChange={e => setNewReport({ ...newReport, weekOfReporting: e.target.value })} /></Col>
              <Col md={4}><Form.Control type="date" value={newReport.dateOfLecture} onChange={e => setNewReport({ ...newReport, dateOfLecture: e.target.value })} /></Col>
              <Col md={4}><Form.Control placeholder="Scheduled Time" value={newReport.scheduledTime} onChange={e => setNewReport({ ...newReport, scheduledTime: e.target.value })} /></Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><Form.Control placeholder="Venue" value={newReport.venue} onChange={e => setNewReport({ ...newReport, venue: e.target.value })} /></Col>
              <Col md={3}><Form.Control placeholder="Present Students" value={newReport.actualStudentsPresent} onChange={e => setNewReport({ ...newReport, actualStudentsPresent: e.target.value })} /></Col>
              <Col md={3}><Form.Control placeholder="Total Students" value={newReport.totalRegisteredStudents} onChange={e => setNewReport({ ...newReport, totalRegisteredStudents: e.target.value })} /></Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Topic Taught</Form.Label>
              <Form.Control as="textarea" rows={2} value={newReport.topicTaught} onChange={e => setNewReport({ ...newReport, topicTaught: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Learning Outcomes</Form.Label>
              <Form.Control as="textarea" rows={2} value={newReport.learningOutcomes} onChange={e => setNewReport({ ...newReport, learningOutcomes: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recommendations</Form.Label>
              <Form.Control as="textarea" rows={2} value={newReport.recommendations} onChange={e => setNewReport({ ...newReport, recommendations: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateReport}>Submit Report</Button>
        </Modal.Footer>
      </Modal>

      {/* View Report Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hasSelectedReport ? (
            <>
              <p><strong>Course:</strong> {selectedReport.courseName}</p>
              <p><strong>Lecturer:</strong> {selectedReport.lecturerName}</p>
              <p><strong>Date:</strong> {selectedReport.dateOfLecture}</p>
              <p><strong>Topic:</strong> {selectedReport.topicTaught}</p>
              <p><strong>Learning Outcomes:</strong> {selectedReport.learningOutcomes}</p>
              <p><strong>Recommendations:</strong> {selectedReport.recommendations}</p>
              {canAddFeedback && !selectedReportHasFeedback && (
                <Form.Group>
                  <Form.Label>PRL Feedback</Form.Label>
                  <Form.Control as="textarea" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </Form.Group>
              )}
              {selectedReport.feedback && (
                <Alert variant="success" className="mt-3">
                  <strong>Feedback:</strong> {selectedReport.feedback}
                </Alert>
              )}
            </>
          ) : (
            <Alert variant="warning">No report selected.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          {canAddFeedback && hasSelectedReport && !selectedReportHasFeedback && (
            <Button variant="primary" onClick={handleSubmitFeedback}>Submit Feedback</Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ReportsView
