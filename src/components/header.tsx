'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart-sheet';

export function Header() {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const { cart } = useCart();
    const [isCartOpen, setCartOpen] = React.useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const logoUrl = mounted
    ? theme === 'dark'
      ? 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760725595/ALQuiMA_jmd6ih.png' // White logo for dark mode
      : 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760728308/ALQuiMA_ewawxs.png' // Black logo for light mode
    : '';

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2" aria-label="Home">
                    <div className="text-4xl font-black text-primary">水</div>
                    {mounted && logoUrl ? (
                        <Image 
                            key={logoUrl} // Force re-render on theme change
                            src={logoUrl} 
                            alt="ALQUIMA" 
                            width={120} 
                            height={40} 
                            className="object-contain" 
                            priority 
                        />
                    ) : (
                        <div style={{ width: 120, height: 40 }} />
                    )}
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {totalItems}
                            </span>
                        )}
                        <span className="sr-only">Abrir carrito de compras</span>
                    </Button>
                    <ThemeToggle />
                </div>
            </header>
            <CartSheet isOpen={isCartOpen} onOpenChange={setCartOpen} />
        </>
    )
}
