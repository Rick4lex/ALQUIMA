
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { EpaycoForm, type EpaycoData } from '@/components/epayco-form';

export function CartSheet({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { toast } = useToast();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    const subtotal = React.useMemo(() => {
        return cart.reduce((acc, item) => {
            const priceNum = item.price ? parseInt(item.price.replace(/\D/g, ''), 10) : 0;
            return acc + (isNaN(priceNum) ? 0 : priceNum * item.quantity);
        }, 0);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast({
                variant: "destructive",
                title: "Tu carrito está vacío",
                description: "Añade algunos productos antes de proceder al pago.",
            });
            return;
        }
        setIsCheckingOut(true);
    };

    const epaycoData: EpaycoData | null = isCheckingOut ? {
        amount: subtotal.toString(),
        name: `Pedido de ${cart.length} artículo(s)`,
        description: cart.map(item => `${item.title} (x${item.quantity})`).join(', '),
        invoice: `ORD-${Date.now()}`,
        currency: 'cop',
        country: 'co',
        lang: 'es',
        external: 'false',
        response: `${window.location.origin}/pago/respuesta`,
        confirmation: `${window.location.origin}/pago/confirmacion`,
        test: "true", // Cambiar a "false" para producción
    } : null;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                    <SheetHeader className="px-6">
                        <SheetTitle>Carrito de Compras</SheetTitle>
                    </SheetHeader>
                    <Separator />
                    {cart.length > 0 ? (
                        <>
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col gap-6 p-6">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-start gap-4">
                                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                                <Image
                                                    src={item.imageUrls[0]}
                                                    alt={item.title || 'Imagen de producto'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">{item.price}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                                        className="h-7 w-12 text-center"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <SheetFooter className="bg-background border-t p-6">
                                <div className="w-full space-y-4">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toLocaleString('es-CO')}</span>
                                    </div>
                                    <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                                        {isCheckingOut ? 'Redirigiendo...' : 'Proceder al Pago'}
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => {
                                        clearCart();
                                        toast({ title: "Carrito vaciado", description: "Todos los artículos han sido eliminados." });
                                    }}>
                                        Vaciar Carrito
                                    </Button>
                                </div>
                            </SheetFooter>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                            <ShoppingCart className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
                            <h3 className="text-xl font-semibold">Tu carrito está vacío</h3>
                            <p className="text-sm text-muted-foreground">
                                Parece que aún no has añadido ningún artículo.
                            </p>
                            <Button onClick={() => onOpenChange(false)}>
                                Seguir comprando
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
            {epaycoData && <EpaycoForm data={epaycoData} />}
        </>
    );
}

