"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, Product } from "./api";
import { useAuth } from "./AuthContext";

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    options?: any;
    product?: Product;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (productId: number, quantity: number, options?: any, productData?: Product) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    cartTotal: number;
    loading: boolean;
    notification: {
        visible: boolean;
        product?: Product;
    };
    hideNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ visible: boolean; product?: Product }>({ visible: false });
    const { user } = useAuth();
    const notificationTimer = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            // Optional: Handle guest cart via localStorage
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await api.getCart();
            setCartItems(data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: number, quantity: number, options?: any, productData?: Product) => {
        if (!user) {
            // Redirect to login or handle guest cart
            window.location.href = '/login';
            return;
        }
        try {
            await api.addToCart(productId, quantity, options);
            await fetchCart();

            // Handle Notification
            if (notificationTimer.current) clearTimeout(notificationTimer.current);
            setNotification({ visible: true, product: productData });
            notificationTimer.current = setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }));
            }, 5000);

        } catch (err) {
            console.error("Failed to add to cart:", err);
            throw err;
        }
    };

    const hideNotification = () => {
        if (notificationTimer.current) clearTimeout(notificationTimer.current);
        setNotification(prev => ({ ...prev, visible: false }));
    };

    const removeFromCart = async (itemId: number) => {
        try {
            await api.removeFromCart(itemId);
            await fetchCart();
        } catch (err) {
            console.error("Failed to remove from cart:", err);
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            await api.updateCartItem(itemId, quantity);
            await fetchCart();
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    const clearCart = async () => {
        try {
            await api.clearCart();
            setCartItems([]);
        } catch (err) {
            console.error("Failed to clear cart:", err);
        }
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = 0; // Totals might need product data joined or calculated on backend

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            cartCount, 
            cartTotal,
            loading,
            notification,
            hideNotification
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
