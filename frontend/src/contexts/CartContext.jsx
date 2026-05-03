import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartRestaurant, setCartRestaurant] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const addToCart = (foodItem, restaurant) => {
        if (cartRestaurant && cartRestaurant.restaurantId !== restaurant.restaurantId) {
            if (!window.confirm('Your cart has items from another restaurant. Clear cart and add this item?')) return;
            setCartItems([]);
            setAppliedCoupon(null);
        }
        setCartRestaurant(restaurant);
        setCartItems(prev => {
            const existing = prev.find(i => i.foodItem.itemId === foodItem.itemId);
            if (existing) return prev.map(i => i.foodItem.itemId === foodItem.itemId ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { foodItem, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(i => i.foodItem.itemId !== itemId));
    };

    const updateQuantity = (itemId, qty) => {
        if (qty <= 0) { removeFromCart(itemId); return; }
        setCartItems(prev => prev.map(i => i.foodItem.itemId === itemId ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => { setCartItems([]); setCartRestaurant(null); setAppliedCoupon(null); };

    const getSubtotal = () => cartItems.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0);
    const getDiscount = () => appliedCoupon ? (getSubtotal() * appliedCoupon.discountPercent / 100) : 0;
    const getTotal = () => getSubtotal() - getDiscount();
    const getItemCount = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartRestaurant, appliedCoupon, setAppliedCoupon,
            addToCart, removeFromCart, updateQuantity, clearCart,
            getSubtotal, getDiscount, getTotal, getItemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
