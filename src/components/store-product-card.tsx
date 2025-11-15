'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

export function StoreProductCard({ product }: { product: ImagePlaceholder }) {
    const { addToCart } = useCart();
    const [isLiked, setIsLiked] = React.useState(false);
    
    const series = (Array.isArray(product.imageHint) ? product.imageHint : [product.imageHint]).slice(0, 2);

    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
            <Link href={`/producto/${product.id}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                        src={product.imageUrls[0]}
                        alt={product.title || 'Imagen de producto'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {!product.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-lg">Agotado</Badge>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-lg leading-tight">
                    <Link href={`/producto/${product.id}`}>
                        {product.title}
                    </Link>
                </h3>
                <p className="mt-2 text-2xl font-bold text-primary">
                    {product.price || 'Consultar'}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                    {series.map(s => (
                        <Badge key={s} variant="secondary" className="text-white bg-gray-600">{s}</Badge>
                    ))}
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                    <Button 
                        className="w-full" 
                        onClick={() => addToCart(product)}
                        disabled={!product.available}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Añadir
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setIsLiked(!isLiked)}
                        aria-label="Añadir a favoritos"
                    >
                        <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
