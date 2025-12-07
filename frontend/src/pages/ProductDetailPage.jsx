import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import './ProductDetailPage.css';

import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, openCart } from '../store/cartSlice';

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        getProduct(id)
            .then(res => {
                setProduct(res.data);
                if(res.data.variants && res.data.variants.length > 0) {
                     setSelectedVariant(res.data.variants[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert("Please login to add items to cart.");
            return;
        }

        // If product has variants, require selection
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            alert("Please select a variant");
            return;
        }

        try {
            if (selectedVariant) {
                await dispatch(addItemToCart({
                    product_variant_id: selectedVariant.id,
                    quantity: quantity
                })).unwrap();
                dispatch(openCart());
            } else {
                alert("This product doesn't have variants yet.");
            }
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Failed to add to cart");
        }
    };

    const incrementQuantity = () => {
        if (quantity < (selectedVariant?.stock || product.stock || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (loading || !product) {
        return <div className="loading">Loading Product Details...</div>;
    }

    const isInStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <div className="product-detail-grid">
                    {/* Product Image Section */}
                    <div className="product-image-section">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="product-main-image" 
                        />
                    </div>

                    {/* Product Info Section */}
                    <div className="product-info-section">
                        <div className="product-category">
                            {product.category_name}
                        </div>
                        
                        <h1 className="product-title">{product.name}</h1>
                        
                        <div className="product-price">
                            ${product.price}
                        </div>

                        <p className="product-description">
                            {product.description || "Experience luxury and elegance with this premium piece from our collection."}
                        </p>

                        {/* Stock Status */}
                        <div className={`product-stock ${!isInStock ? 'out-of-stock' : ''}`}>
                            <span className={`stock-text ${!isInStock ? 'out' : ''}`}>
                                {isInStock ? 
                                    `✓ In Stock (${selectedVariant?.stock || product.stock || 'Available'})` : 
                                    '✗ Out of Stock'
                                }
                            </span>
                        </div>

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="variant-section">
                                <h3>Select Size</h3>
                                <div className="variant-options">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            className={`variant-btn ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedVariant(variant)}
                                            disabled={variant.stock === 0}
                                        >
                                            {variant.size || variant.color || `Option ${variant.id}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="quantity-selector">
                            <h3>Quantity</h3>
                            <div className="quantity-controls">
                                <button 
                                    className="quantity-btn" 
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button 
                                    className="quantity-btn" 
                                    onClick={incrementQuantity}
                                    disabled={quantity >= (selectedVariant?.stock || product.stock || 10)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="add-to-cart-section">
                            <button 
                                className="btn-add-cart"
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                            >
                                {isInStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Product Features */}
                        <div className="product-features">
                            <h3>Product Details</h3>
                            <ul className="features-list">
                                <li>Premium quality materials</li>
                                <li>Expertly crafted design</li>
                                <li>Comfortable fit</li>
                                <li>Easy care instructions</li>
                                <li>Sustainable sourcing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
