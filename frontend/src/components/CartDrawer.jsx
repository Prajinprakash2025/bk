import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCart, removeItem, updateItemQuantity, fetchCart } from '../store/cartSlice';
import './CartDrawer.css';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const { items, totalPrice, isOpen, loading } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (isOpen && isAuthenticated) {
           dispatch(fetchCart());
        }
    }, [isOpen, isAuthenticated, dispatch]);

    console.log("CartDrawer State:", { items, totalPrice, isOpen, loading });

    if (!isOpen) return null;

    // Safety checks
    const safeItems = items || [];
    const safeTotal = typeof totalPrice === 'number' ? totalPrice : 0;

    return (
        <>
            <div className="cart-overlay" onClick={() => dispatch(closeCart())}></div>
            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>Your Bag ({safeItems.length})</h2>
                    <button className="close-btn" onClick={() => dispatch(closeCart())}>×</button>
                </div>

                <div className="cart-items">
                    {safeItems.length === 0 ? (
                        <div className="empty-cart">Your bag is empty.</div>
                    ) : (
                        safeItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.product_image} alt={item.product_name} />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.product_name}</h3>
                                    <p className="variant-info">{item.product_variant?.size} / {item.product_variant?.color}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                                    </div>
                                    <p className="item-price">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                    <button className="remove-btn" onClick={() => dispatch(removeItem(item.id))}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total</span>
                        <span>${safeTotal.toFixed(2)}</span>
                    </div>
                    <button className="btn-primary checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
