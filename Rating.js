import React, { useState, useEffect } from 'react'
import {
  Container, Row, Col, Card, Form, Button, Alert, Badge
} from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

const Rating = () => {
  const { user } = useAuth()
  const [ratings, setRatings] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [ratingData, setRatingData] = useState({
    course: '', lecturer: '', rating: 0, comments: '', anonymous: false
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const mockCourses = [
    { id: 1, name: 'Web Design', code: 'BIWD2110', lecturer: 'Dr. Tseliso Thokoane' },
    { id: 2, name: 'Database Systems', code: 'BIDS2111', lecturer: 'Prof. Mokete' },
    { id: 3, name: 'Software Engineering', code: 'BISE2112', lecturer: 'Dr. Sekopo' }
  ]

  const mockRatings = [
    {
      id: 1,
      course: 'Web Design',
      lecturer: 'Dr. Tseliso Thokoane',
      rating: 4.5,
      comments: 'Excellent teaching methodology and very helpful.',
      date: '2024-03-15',
      student: 'Student 1',
      studentId: 's1'
    },
    {
      id: 2,
      course: 'Database Systems',
      lecturer: 'Dr. Teboho Kolisang',
      rating: 4.2,
      comments: 'Good practical examples and clear explanations.',
      date: '2024-03-14',
      student: 'Student 2',
      studentId: 's2'
    }
  ]

  useEffect(() => {
    setRatings(mockRatings)
  }, [])

  const handleRatingChange = (value) =>
    setRatingData(prev => ({ ...prev, rating: value }))

  const handleCourseSelect = (courseId) => {
    const course = mockCourses.find(c => c.id === parseInt(courseId))
    setSelectedCourse(courseId)
    setRatingData(prev => ({
      ...prev,
      course: course?.name || '',
      lecturer: course?.lecturer || ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCourse || ratingData.rating === 0) {
      alert('Please select a course and a rating')
      return
    }
    setLoading(true)
    try {
      const newRating = {
        id: Date.now(),
        course: ratingData.course,
        lecturer: ratingData.lecturer,
        rating: ratingData.rating,
        comments: ratingData.comments,
        date: new Date().toISOString().split('T')[0],
        student: ratingData.anonymous ? 'Anonymous' : user?.name || 'User',
        studentId: user?.id || 'unknown' // unique student id
      }

      // Add rating (shared so both lecturer and student can see)
      setRatings(prev => [newRating, ...prev])
      setSubmitted(true)
      setRatingData({ course: '', lecturer: '', rating: 0, comments: '', anonymous: false })
      setSelectedCourse('')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete your rating?')) {
      setRatings(prev => prev.filter(r => r.id !== id))
    }
  }

  const getAverageRating = () => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const getCourseStats = (courseName) => {
    const courseRatings = ratings.filter(r => r.course === courseName)
    if (courseRatings.length === 0) return { average: 0, count: 0 }
    const average = courseRatings.reduce((acc, curr) => acc + curr.rating, 0) / courseRatings.length
    return { average: average.toFixed(1), count: courseRatings.length }
  }

  const trendingCourses = () => {
    return mockCourses.map(c => {
      const stats = getCourseStats(c.name)
      return { course: c.name, average: parseFloat(stats.average) }
    }).sort((a, b) => b.average - a.average)
  }

  const canViewRatings = user?.role === 'lecturer' || user?.role === 'admin'

  if (!user) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="text-center">
          Please log in to access the rating system.
        </Alert>
      </Container>
    )
  }

  // Ratings visible based on user role
  const visibleRatings = canViewRatings
    ? ratings // lecturers/admins see all
    : ratings.filter(r => r.studentId === user?.id) // students see only their own

  return (
    <Container className="py-4">
      <Row>
        <Col lg={canViewRatings ? 6 : 12}>
          <Card className="shadow h-100">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Submit Rating</h4>
            </Card.Header>
            <Card.Body>
              {submitted && <Alert variant="success">Thank you! Your rating has been submitted successfully.</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Course *</Form.Label>
                  <Form.Select
                    value={selectedCourse}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">Choose a course...</option>
                    {mockCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.code}) - {course.lecturer}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedCourse && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating *</Form.Label>
                      <div className="d-flex justify-content-center mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button
                            key={star}
                            variant="outline-warning"
                            className="mx-1"
                            style={{
                              backgroundColor: star <= ratingData.rating ? '#ffc107' : 'transparent',
                              borderColor: '#ffc107',
                              color: star <= ratingData.rating ? '#000' : '#ffc107',
                              width: '50px', height: '50px', fontSize: '1.2rem'
                            }}
                            onClick={() => handleRatingChange(star)}
                            disabled={loading}
                            type="button"
                          >
                            ⭐
                          </Button>
                        ))}
                      </div>
                      <small className="text-muted">Selected: {ratingData.rating} / 5 stars</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Comments</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={ratingData.comments}
                        onChange={(e) => setRatingData(prev => ({ ...prev, comments: e.target.value }))}
                        placeholder="Share your feedback..."
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Submit anonymously"
                        checked={ratingData.anonymous}
                        onChange={(e) => setRatingData(prev => ({ ...prev, anonymous: e.target.checked }))}
                        disabled={loading}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={loading || ratingData.rating === 0}>
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {canViewRatings && (
          <Col lg={6}>
            <Card className="shadow h-100">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Rating Analytics</h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center mb-4">
                  <Col>
                    <div className="display-4 text-warning">{getAverageRating()}</div>
                    <p className="text-muted">Average Rating</p>
                  </Col>
                  <Col>
                    <div className="display-4 text-primary">{ratings.length}</div>
                    <p className="text-muted">Total Ratings</p>
                  </Col>
                  <Col>
                    <div className="display-4 text-success">
                      {ratings.length > 0
                        ? Math.round((ratings.filter(r => r.rating >= 4).length / ratings.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-muted">Satisfaction Rate</p>
                  </Col>
                </Row>

                <h6 className="mb-3">Trending Courses</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={trendingCourses()} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#ffc107" />
                  </BarChart>
                </ResponsiveContainer>

                <hr />
                <h5 className="mb-3">Recent Ratings</h5>
                {visibleRatings.length > 0 ? (
                  visibleRatings.slice(0, 5).map(r => (
                    <Card key={r.id} className="mb-3">
                      <Card.Body className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1 text-primary">{r.course}</h6>
                          <p className="mb-1 text-muted small">{r.lecturer}</p>
                          <p className="mb-2 small">{r.comments}</p>
                          <small className="text-muted">By {r.student} • {r.date}</small>
                        </div>
                        <div className="d-flex align-items-start">
                          <Badge bg="warning" text="dark" className="ms-3">{r.rating} ⭐</Badge>
                          {r.studentId === user?.id && (
                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(r.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Alert variant="info" className="text-center">No ratings submitted yet.</Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default Rating
