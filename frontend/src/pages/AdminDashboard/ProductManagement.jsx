import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import { FaEdit, FaTrash, FaBan, FaCheck, FaPlus } from 'react-icons/fa';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/admin/products/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8000/api/admin/products/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const toggleActive = async (product) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`http://localhost:8000/api/admin/products/${product.id}/`, 
                { is_active: !product.is_active },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProductToEdit(null);
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="product-management">
            <div className="page-header">
                <h1 className="page-title">Product Management</h1>
                <button className="btn-primary" onClick={() => { setProductToEdit(null); setShowModal(true); }}>
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Product
                </button>
            </div>

            <AddProductModal 
                show={showModal} 
                handleClose={handleCloseModal}
                onProductAdded={fetchProducts}
                productToEdit={productToEdit}
            />

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>#{product.id}</td>
                                <td>
                                    {product.image && (
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category_name}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(product)}
                                        className="btn-small"
                                        title="Edit"
                                        style={{ marginRight: '0.5rem' }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => toggleActive(product)}
                                        className={`btn-small ${product.is_active ? 'btn-warning' : 'btn-success'}`}
                                        title={product.is_active ? 'Deactivate' : 'Activate'}
                                        style={{ marginRight: '0.5rem', borderColor: product.is_active ? '#ffc107' : '#28a745', color: product.is_active ? '#ffc107' : '#28a745' }}
                                    >
                                        {product.is_active ? <FaBan /> : <FaCheck />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="btn-small btn-danger"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
