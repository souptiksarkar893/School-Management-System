import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { schoolAPI } from '../services/api';

const AddSchool = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'image') {
          if (data[key][0]) {
            formData.append('image', data[key][0]);
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await schoolAPI.addSchool(formData);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'School added successfully!' 
        });
        reset();
        setImagePreview(null);
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Error adding school:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to add school. Please try again.' 
      });
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Success/Error Alert */}
      {message.text && (
        <Alert 
          variant={message.type === 'success' ? 'success' : 'danger'} 
          className={message.type === 'success' ? 'alert-success-sticky' : 'alert-danger'}
          dismissible
          onClose={() => setMessage({ type: '', text: '' })}
        >
          <div className="d-flex align-items-center">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
            <strong>{message.text}</strong>
          </div>
        </Alert>
      )}
      
      <div className="add-school-container">
        <div className="form-container">
          <h2 className="page-title">Add New School</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* School Name */}
              <Row className="mb-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label">School Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter school name"
                      size="lg"
                      {...register('name', {
                        required: 'School name is required',
                        minLength: {
                          value: 2,
                          message: 'School name must be at least 2 characters'
                        }
                      })}
                      isInvalid={!!errors.name}
                    />
                    {errors.name && (
                      <div className="error-text">{errors.name.message}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Address */}
              <Row className="mb-4">
                <Col md={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter school address"
                      size="lg"
                      {...register('address', {
                        required: 'Address is required',
                        minLength: {
                          value: 10,
                          message: 'Address must be at least 10 characters'
                        }
                      })}
                      isInvalid={!!errors.address}
                    />
                    {errors.address && (
                      <div className="error-text">{errors.address.message}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* City and State */}
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">City *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter city"
                      size="lg"
                      {...register('city', {
                        required: 'City is required',
                        minLength: {
                          value: 2,
                          message: 'City must be at least 2 characters'
                        }
                      })}
                      isInvalid={!!errors.city}
                    />
                    {errors.city && (
                      <div className="error-text">{errors.city.message}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">State *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter state"
                      size="lg"
                      {...register('state', {
                        required: 'State is required',
                        minLength: {
                          value: 2,
                          message: 'State must be at least 2 characters'
                        }
                      })}
                      isInvalid={!!errors.state}
                    />
                    {errors.state && (
                      <div className="error-text">{errors.state.message}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Contact and Email */}
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Contact Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter contact number"
                      size="lg"
                      {...register('contact', {
                        required: 'Contact number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Please enter a valid 10-digit Indian mobile number'
                        }
                      })}
                      isInvalid={!!errors.contact}
                    />
                    {errors.contact && (
                      <div className="error-text">{errors.contact.message}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Email ID *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      size="lg"
                      {...register('email_id', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      isInvalid={!!errors.email_id}
                    />
                    {errors.email_id && (
                      <div className="error-text">{errors.email_id.message}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* School Image */}
              <Row className="mb-5">
                <Col md={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">School Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      size="lg"
                      {...register('image', {
                        validate: {
                          fileSize: (files) => {
                            if (files[0] && files[0].size > 5 * 1024 * 1024) {
                              return 'File size should not exceed 5MB';
                            }
                            return true;
                          },
                          fileType: (files) => {
                            if (files[0] && !files[0].type.startsWith('image/')) {
                              return 'Please select only image files';
                            }
                            return true;
                          }
                        }
                      })}
                      onChange={(e) => {
                        handleImageChange(e);
                      }}
                      isInvalid={!!errors.image}
                    />
                    {errors.image && (
                      <div className="error-text">{errors.image.message}</div>
                    )}
                    
                    {imagePreview && (
                      <div className="mt-4 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Submit Button */}
              <Row>
                <Col md={6} className="mx-auto">
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="py-3"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Adding School...
                        </>
                      ) : (
                        'Add School'
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </>
  );
};

export default AddSchool;
