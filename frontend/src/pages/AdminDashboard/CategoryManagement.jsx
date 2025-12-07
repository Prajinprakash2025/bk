import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AddCategoryModal from './AddCategoryModal';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/categories/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8000/api/admin/categories/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const handleEdit = (category) => {
        setCategoryToEdit(category);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryToEdit(null);
    };

    if (loading) return <div className="loading">Loading categories...</div>;

    return (
        <div className="category-management">
            <div className="page-header">
                <h1 className="page-title">Category Management</h1>
                <button className="btn-primary" onClick={() => { setCategoryToEdit(null); setShowModal(true); }}>
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Category
                </button>
            </div>

            <AddCategoryModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                onCategoryAdded={fetchCategories}
                categoryToEdit={categoryToEdit}
            />

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>#{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description || '-'}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(category)}
                                        className="btn-small"
                                        title="Edit"
                                        style={{ marginRight: '0.5rem' }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(category.id)}
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

export default CategoryManagement;
