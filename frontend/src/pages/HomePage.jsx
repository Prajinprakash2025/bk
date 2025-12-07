import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch categories
        getCategories()
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.error("Error fetching categories", err));

        // Fetch featured products
        getProducts()
            .then(res => {
                setFeaturedProducts(res.data.slice(0, 4));
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <h1 className="hero-title">BK COLLECTION</h1>
                    <p className="hero-subtitle">Elegance Meets Style</p>
                    <Link to="/shop" className="btn-primary">
                        Explore Collection
                    </Link>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section container">
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-subtitle">Discover our curated collections</p>
                
                <div className="categories-grid">
                    {categories.map(category => (
                        <Link 
                            to={`/shop?category=${category.id}`} 
                            key={category.id}
                            className="category-card"
                        >
                            <div className="category-image-wrapper">
                                <div className="category-overlay"></div>
                                <h3 className="category-name">{category.name}</h3>
                                <p className="category-cta">Browse →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section container">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Featured Collection</h2>
                        <p className="section-subtitle">Handpicked pieces for you</p>
                    </div>
                    <Link to="/shop" className="view-all-link">
                        View All →
                    </Link>
                </div>
                
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Why Choose Us Section */}
            <section className="features-section container">
                <h2 className="section-title">Why Choose BK</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">✓</div>
                        <h3>Premium Quality</h3>
                        <p>Handcrafted with the finest materials</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Fast Shipping</h3>
                        <p>Free delivery on orders over $100</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">↻</div>
                        <h3>Easy Returns</h3>
                        <p>30-day hassle-free return policy</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">★</div>
                        <h3>Style Expertise</h3>
                        <p>Personal styling advice available</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section container">
                <h2 className="section-title">What Our Customers Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">
                            "Absolutely love my purchase! The quality is outstanding and the fit is perfect. 
                            Will definitely shop here again."
                        </p>
                        <p className="testimonial-author">— Sarah M.</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">
                            "Beautiful dresses and excellent customer service. The delivery was fast and 
                            everything arrived perfectly packaged."
                        </p>
                        <p className="testimonial-author">— Emily R.</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">
                            "I received so many compliments! The craftsmanship is exceptional and the 
                            attention to detail is remarkable."
                        </p>
                        <p className="testimonial-author">— Jessica L.</p>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <h2>Stay in Style</h2>
                        <p>Subscribe to get exclusive offers, style tips, and early access to new collections</p>
                        <form className="newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="btn-primary">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
