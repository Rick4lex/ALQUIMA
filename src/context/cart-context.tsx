'use client';

import * as React from 'react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useToast } from "@/hooks/use-toast";

export type CartItem = ImagePlaceholder & {
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: ImagePlaceholder) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [cart, setCart] = React.useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const item = window.localStorage.getItem('cart');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    React.useEffect(() => {
        try {
            window.localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error(error);
        }
    }, [cart]);

    const addToCart = (product: ImagePlaceholder) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        toast({
            title: "¡Añadido al carrito!",
            description: `${product.title} ha sido añadido a tu carrito.`,
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
