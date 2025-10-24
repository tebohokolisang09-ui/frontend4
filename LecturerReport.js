import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const LecturerReport = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    facultyName: '',
    className: '',
    weekOfReporting: '',
    dateOfLecture: '',
    courseName: '',
    courseCode: '',
    lecturerName: '',
    actualStudentsPresent: '',
    totalRegisteredStudents: '',
    venue: '',
    scheduledTime: '',
    topicTaught: '',
    learningOutcomes: '',
    recommendations: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        lecturerName: user.name
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Simulate API call - replace with actual endpoint
      console.log('Submitting report:', formData)
      
      // Reset form
      setFormData({
        facultyName: '',
        className: '',
        weekOfReporting: '',
        dateOfLecture: '',
        courseName: '',
        courseCode: '',
        lecturerName: user.name,
        actualStudentsPresent: '',
        totalRegisteredStudents: '',
        venue: '',
        scheduledTime: '',
        topicTaught: '',
        learningOutcomes: '',
        recommendations: ''
      })
      
      setSuccess('Report submitted successfully!')
    } catch (err) {
      setError('Failed to submit report. Please try again.')
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Lecturer Reporting Form</h4>
            </Card.Header>
            <Card.Body>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Faculty Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="facultyName"
                        value={formData.facultyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Faculty of ICT"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                        required
                        placeholder="e.g., SE101"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Week of Reporting *</Form.Label>
                      <Form.Control
                        type="text"
                        name="weekOfReporting"
                        value={formData.weekOfReporting}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Week 6"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Lecture *</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfLecture"
                        value={formData.dateOfLecture}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Web Design"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="courseCode"
                        value={formData.courseCode}
                        onChange={handleChange}
                        required
                        placeholder="e.g., BIWD2110"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Lecturer's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lecturerName"
                        value={formData.lecturerName}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Actual Students Present *</Form.Label>
                      <Form.Control
                        type="number"
                        name="actualStudentsPresent"
                        value={formData.actualStudentsPresent}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Registered Students *</Form.Label>
                      <Form.Control
                        type="number"
                        name="totalRegisteredStudents"
                        value={formData.totalRegisteredStudents}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Venue *</Form.Label>
                      <Form.Control
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Room 101"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scheduled Lecture Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Topic Taught *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="topicTaught"
                    value={formData.topicTaught}
                    onChange={handleChange}
                    required
                    placeholder="Describe the topic covered in this lecture..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Learning Outcomes *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleChange}
                    required
                    placeholder="List the learning outcomes achieved..."
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Lecturer's Recommendations</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    placeholder="Any recommendations or observations..."
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Submit Report
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LecturerReport