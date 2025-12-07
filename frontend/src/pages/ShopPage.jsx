import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    // Fetch categories for filter
    getCategories()
        .then(res => setCategories(res.data))
        .catch(err => console.error("Error fetching categories", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (sortOrder) params.ordering = sortOrder;

    getProducts(params)
      .then(res => {
        console.log("ShopPage products response:", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="shop-page">
      <header className="shop-header">
        <h1 className="section-title">The Collection</h1>
      </header>

      <div className="shop-layout">
        <aside className="shop-sidebar">
            <div className="filter-group">
                <h3>Search</h3>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
            </div>
            
            <div className="filter-group">
                <h3>Category</h3>
                <div className="category-list">
                    <button 
                        className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h3>Sort By</h3>
                <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Default</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-created_at">Newest Arrivals</option>
                </select>
            </div>
        </aside>

        <main className="shop-main">
            {loading ? (
                <div className="loading">Updating Collection...</div>
            ) : (
                <>
                    <p className="results-count">{products.length} Products Found</p>
                    <div className="product-grid">
                        {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {products.length === 0 && (
                        <div className="no-results">No products match your filters.</div>
                    )}
                </>
            )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
