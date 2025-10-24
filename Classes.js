import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Alert, InputGroup, FormControl, Row, Col, Badge, Pagination } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const itemsPerPage = 10;

  // Determine user permissions
  const isLecturer = user.role === "lecturer";
  const canPerformActions = ["prl", "pl"].includes(user.role);

  // Fetch classes and lecturers on mount
  useEffect(() => {
    fetchClasses();
    if (canPerformActions) {
      fetchLecturers();
    }
  }, []);

  // Filter and sort whenever classes/search/sort change
  useEffect(() => {
    filterAndSortClasses();
  }, [classes, search, sortKey, sortOrder]);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get("/classes");
      setClasses(res.data || []);
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Failed to load classes", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch lecturers from backend (only for PRL/PL)
  const fetchLecturers = async () => {
    try {
      const res = await axios.get("/users?role=lecturer");
      setLecturers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setLecturers([]);
    }
  };

  const filterAndSortClasses = () => {
    let temp = [...classes];
    if (search) {
      temp = temp.filter(
        (cls) =>
          cls.class_name?.toLowerCase().includes(search.toLowerCase()) ||
          cls.course_name?.toLowerCase().includes(search.toLowerCase()) ||
          cls.lecturer?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortKey) {
      temp.sort((a, b) => {
        const valA = a[sortKey] ? a[sortKey].toString().toLowerCase() : "";
        const valB = b[sortKey] ? b[sortKey].toString().toLowerCase() : "";
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredClasses(temp);
    setCurrentPage(1);
  };

  const handleEditClick = (cls) => {
    // Only allow PRL/PL to edit
    if (!canPerformActions) return;
    
    setSelectedClass(cls);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    // Only allow PRL/PL to create
    if (!canPerformActions) return;
    
    setSelectedClass({
      class_name: "",
      course_name: "",
      course_code: "",
      lecturer: "",
      schedule: "",
      venue: "",
      capacity: "",
      status: "active",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Only allow PRL/PL to delete
    if (!canPerformActions) return;
    
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await axios.delete(`/classes/${id}`);
      setClasses(classes.filter((cls) => cls.id !== id));
      setAlert({ show: true, message: "Class deleted successfully", variant: "success" });
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Failed to delete class", variant: "danger" });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedClass(null);
    setIsCreating(false);
  };

  const handleSaveChanges = async () => {
    // Only allow PRL/PL to save changes
    if (!canPerformActions) return;
    
    try {
      const payload = {
        class_name: selectedClass.class_name,
        course_name: selectedClass.course_name,
        course_code: selectedClass.course_code,
        lecturer: selectedClass.lecturer,
        schedule: selectedClass.schedule,
        venue: selectedClass.venue,
        capacity: selectedClass.capacity,
        status: selectedClass.status,
        created_by: user.name,
      };

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let res;
      if (isCreating) {
        res = await axios.post("/classes", payload, config);
        setClasses([res.data.class, ...classes]);
        setAlert({ show: true, message: "Class created successfully", variant: "success" });
      } else {
        res = await axios.put(`/classes/${selectedClass.id}`, payload, config);
        setClasses(classes.map((cls) => (cls.id === selectedClass.id ? res.data.class : cls)));
        setAlert({ show: true, message: "Class updated successfully", variant: "success" });
      }

      handleModalClose();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      setAlert({
        show: true,
        message: isCreating ? "Failed to create class" : "Failed to update class",
        variant: "danger",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedClass({ ...selectedClass, [name]: value });
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusBadge = (status) => {
    if (status === "active") return <Badge bg="success">{status}</Badge>;
    if (status === "inactive") return <Badge bg="secondary">{status}</Badge>;
    return <Badge bg="info">{status}</Badge>;
  };

  if (loading) return <p>Loading classes...</p>;

  return (
    <Container fluid className="p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <h1 className="mb-4">📚 Class Management</h1>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <FormControl placeholder="Search by class, course, lecturer..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          {canPerformActions && (
            <Button variant="success" onClick={handleCreateClick}>+ Create New Class</Button>
          )}
          {isLecturer && (
            <Badge bg="info" className="p-2">
              View Only Mode
            </Badge>
          )}
        </Col>
      </Row>

      <div style={{ overflowX: "auto" }}>
        <Table striped hover responsive className="table-full text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("class_name")}>Class Name</th>
              <th onClick={() => handleSort("course_name")}>Course Name</th>
              <th onClick={() => handleSort("course_code")}>Course Code</th>
              <th onClick={() => handleSort("lecturer")}>Lecturer</th>
              <th>Schedule</th>
              <th>Venue</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              {canPerformActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedClasses.map((cls) => (
              <tr key={cls.id}>
                <td><strong>{cls.class_name}</strong></td>
                <td>{cls.course_name}</td>
                <td>{cls.course_code}</td>
                <td>{cls.lecturer}</td>
                <td>{cls.schedule || "-"}</td>
                <td>{cls.venue || "-"}</td>
                <td><Badge bg="info">{cls.capacity}</Badge></td>
                <td>{statusBadge(cls.status)}</td>
                <td>{cls.created_by}</td>
                <td>{new Date(cls.created_at).toLocaleString()}</td>
                <td>{cls.updated_at ? new Date(cls.updated_at).toLocaleString() : "-"}</td>
                {canPerformActions && (
                  <td>
                    <Button variant="outline-warning" size="sm" onClick={() => handleEditClick(cls)} className="me-2">Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cls.id)}>Delete</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item key={idx + 1} active={currentPage === idx + 1} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}

      {/* Edit/Create Modal - Only show for PRL/PL */}
      {canPerformActions && (
        <Modal show={showModal} onHide={handleModalClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{isCreating ? "Create New Class" : "Edit Class"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClass && (
              <Form>
                {[ 
                  { label: "Class Name", name: "class_name" },
                  { label: "Course Name", name: "course_name" },
                  { label: "Course Code", name: "course_code" },
                  { label: "Schedule", name: "schedule" },
                  { label: "Venue", name: "venue" },
                  { label: "Capacity", name: "capacity", type: "number" },
                  { label: "Status", name: "status" },
                ].map((field) => (
                  <Form.Group className="mb-2" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      type={field.type || "text"}
                      name={field.name}
                      value={selectedClass[field.name]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}

                {/* Lecturer field - Only for PRL/PL */}
                <Form.Group className="mb-2">
                  <Form.Label>Lecturer</Form.Label>
                  <Form.Select
                    name="lecturer"
                    value={selectedClass.lecturer || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Lecturer</option>
                    {lecturers.length > 0
                      ? lecturers.map((lect) => (
                          <option key={lect.user_id} value={lect.name}>{lect.name}</option>
                        ))
                      : <option disabled>Loading lecturers...</option>}
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveChanges}>{isCreating ? "Create Class" : "Save Changes"}</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Classes;