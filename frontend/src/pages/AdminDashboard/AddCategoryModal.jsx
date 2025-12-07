import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ModalOverrides.css';

const AddCategoryModal = ({ show, handleClose, onCategoryAdded, categoryToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            if (categoryToEdit) {
                setFormData({
                    name: categoryToEdit.name,
                    description: categoryToEdit.description || '',
                    image: null
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    image: null
                });
            }
        }
    }, [show, categoryToEdit]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.description) data.append('description', formData.description);
            if (formData.image) data.append('image', formData.image);

            let response;
            if (categoryToEdit) {
                response = await axios.patch(`http://localhost:8000/api/admin/categories/${categoryToEdit.id}/`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post('http://localhost:8000/api/admin/categories/', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            onCategoryAdded();
            handleClose();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Category Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter category name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter description (optional)"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (categoryToEdit ? 'Update Category' : 'Create Category')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryModal;
