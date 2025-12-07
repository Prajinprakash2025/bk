import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-container">
        {product.image ? (
            <img src={product.image} alt={product.name} className="product-image" />
        ) : (
            <div className="no-image-placeholder">No Image</div>
        )}
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <h3 className="product-title">{product.name}</h3>
        <div className="product-footer">
            <span className="product-price">${product.price}</span>
            <button className="add-to-cart-btn">ADD</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
