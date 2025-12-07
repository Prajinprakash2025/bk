import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ModalOverrides.css';

const AddProductModal = ({ show, handleClose, onProductAdded, productToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        category: '',
        image: null,
        is_active: true
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (show) {
            fetchCategories();
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name,
                    description: productToEdit.description || '',
                    price: productToEdit.price,
                    stock: productToEdit.stock,
                    category: productToEdit.category,
                    image: null,
                    is_active: productToEdit.is_active
                });
            } else {
                // Reset form for new product
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: 0,
                    category: '',
                    image: null,
                    is_active: true
                });
            }
        }
    }, [show, productToEdit]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/categories/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const data = new FormData();
            
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            data.append('category', formData.category);
            data.append('is_active', formData.is_active);
            
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (productToEdit) {
                await axios.patch(`http://localhost:8000/api/admin/products/${productToEdit.id}/`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:8000/api/admin/products/', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: 0,
                category: '',
                image: null,
                is_active: true
            });

            onProductAdded();
            handleClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{productToEdit ? 'Edit Product' : 'Add New Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter product name"
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
                            placeholder="Enter product description"
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Price *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="is_active"
                            label="Active (visible in shop)"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (productToEdit ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;
