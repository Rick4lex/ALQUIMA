'use client';

import * as React from 'react';
import { CartContext } from '@/context/cart-context';

export function useCart() {
    const context = React.useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}
