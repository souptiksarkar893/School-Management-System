import { Card } from 'react-bootstrap';

const SchoolCard = ({ school }) => {
  return (
    <Card className="school-card h-100">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={school.image}
          alt={school.name}
          className="school-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200/6c757d/ffffff?text=School+Image';
          }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-primary fs-5 mb-2">
          {school.name}
        </Card.Title>
        <Card.Text className="text-muted mb-1">
          <i className="fas fa-map-marker-alt me-2"></i>
          {school.address}
        </Card.Text>
        <Card.Text className="text-muted mb-2">
          <i className="fas fa-city me-2"></i>
          {school.city}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SchoolCard;
