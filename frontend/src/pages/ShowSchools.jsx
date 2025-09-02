import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { schoolAPI } from '../services/api';
import SchoolCard from '../components/SchoolCard';

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);

  const schoolsPerPage = 12;

  // Fetch schools from API
  const fetchSchools = async (page = 1, search = '') => {
    setLoading(true);
    setError('');

    try {
      const response = await schoolAPI.getAllSchools({
        page,
        limit: schoolsPerPage,
        search: search.trim()
      });

      if (response.success) {
        setSchools(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalSchools(response.pagination.total);
        setCurrentPage(response.pagination.page);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError('Failed to fetch schools. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchools(1, '');
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchools(1, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSchools(page, searchTerm);
    window.scrollTo(0, 0);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchSchools(1, '');
  };

  if (loading && schools.length === 0) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading schools...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="show-schools-container">
      {/* Header */}
      <Row>
        <Col>
          <h2 className="text-center mb-4 text-primary">School Directory</h2>
        </Col>
      </Row>
      
      {/* Search Bar */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} lg={10} xl={8}>
          <div className="search-container">
            <Form onSubmit={handleSearch}>
              <div className="search-form-wrapper">
                <div className="search-field-wrapper">
                  <Form.Group>
                    <Form.Label className="form-label">Search Schools</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, city, or state..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      size="lg"
                    />
                  </Form.Group>
                </div>
                <div className="search-button-wrapper">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="search-btn"
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleClearSearch}
                      size="lg"
                      className="clear-btn"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      {/* Results Summary */}
      {!loading && (
        <Row className="justify-content-center mb-3">
          <Col xs={12} lg={10} xl={8}>
            <p className="text-muted text-center">
              {searchTerm ? (
                <>Showing {schools.length} of {totalSchools} schools matching "{searchTerm}"</>
              ) : (
                <>Showing {schools.length} of {totalSchools} schools</>
              )}
            </p>
          </Col>
        </Row>
      )}

      {/* Error Alert */}
      {error && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={10} xl={8}>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Schools Grid */}
      {!loading && schools.length === 0 ? (
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Alert variant="info" className="text-center">
              {searchTerm ? (
                <>
                  No schools found matching "{searchTerm}". 
                  <Button variant="link" onClick={handleClearSearch}>
                    Show all schools
                  </Button>
                </>
              ) : (
                'No schools found. Add the first school to get started!'
              )}
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="schools-container">
              <Row className="g-4">
                {schools.map((school) => (
                  <Col key={school.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                    <SchoolCard school={school} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <nav aria-label="Schools pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                </li>
                
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <li key={page} className={`page-item ${isCurrentPage ? 'active' : ''}`}>
                        <Button
                          variant={isCurrentPage ? 'primary' : 'outline-primary'}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className="mx-1"
                        >
                          {page}
                        </Button>
                      </li>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <li key={page} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </li>
              </ul>
            </nav>
          </Col>
        </Row>
      )}

      {/* Loading overlay for pagination */}
      {loading && schools.length > 0 && (
        <div className="text-center mt-3">
          <Spinner animation="border" role="status" variant="primary" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
};

export default ShowSchools;
