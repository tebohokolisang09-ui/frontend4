import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    credits: 3,
    lecturer: '',
    stream: '',
    semester: 1
  })
  const [error, setError] = useState('')

  const mockLecturers = [
    'Dr. Tsekiso Thokoane',
    'Prof. Mokete',
    'Dr. Sekopo',
    'Dr. Emily Davis'
  ]

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses') // Replace with your backend URL
      setCourses(response.data)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to fetch courses from the server.')
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleShowModal = (course = null) => {
    if (course) {
      setEditingCourse(course)
      setFormData(course)
    } else {
      setEditingCourse(null)
      setFormData({
        courseCode: '',
        courseName: '',
        description: '',
        credits: 3,
        lecturer: '',
        stream: '',
        semester: 1
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCourse(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        // Update course
        await axios.put(`http://localhost:5000/courses/${editingCourse.course_id}`, formData)
      } else {
        // Create new course
        await axios.post('http://localhost:5000/courses', formData)
      }
      fetchCourses() // refresh list
      handleCloseModal()
    } catch (err) {
      console.error(err)
      setError('Failed to save course.')
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Courses</h4>
              <Button variant="light" onClick={() => handleShowModal()}>+ Add Course</Button>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Lecturer</th>
                    <th>Stream</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.course_id}>
                      <td>{course.course_code}</td>
                      <td>{course.course_name}</td>
                      <td>{course.credits || '-'}</td>
                      <td>{course.lecturer || 'Not assigned'}</td>
                      <td>{course.stream || '-'}</td>
                      <td>{course.semester || '-'}</td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleShowModal(course)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Course Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCourse ? 'Edit Course' : 'Add New Course'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.courseCode}
                    onChange={e => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.courseName}
                    onChange={e => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Select
                    value={formData.credits}
                    onChange={e => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                  >
                    {[1,2,3,4,5].map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    value={formData.semester}
                    onChange={e => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                  >
                    {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stream</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.stream}
                    onChange={e => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Assign Lecturer</Form.Label>
              <Form.Select
                value={formData.lecturer}
                onChange={e => setFormData(prev => ({ ...prev, lecturer: e.target.value }))}
              >
                <option value="">Select Lecturer</option>
                {mockLecturers.map(l => <option key={l} value={l}>{l}</option>)}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="submit">{editingCourse ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Courses
