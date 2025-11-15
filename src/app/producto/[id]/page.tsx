'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

function ProductGallery({ images, title }: { images: string[]; title: string }) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                    src={images[currentIndex]}
                    alt={`${title} - imagen ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                />
                 {images.length > 1 && (
                    <>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-16 w-16 cursor-pointer overflow-hidden rounded-md border-2",
                                currentIndex === index ? 'border-primary' : 'border-transparent'
                            )}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <Image
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function ProductDetailPage() {
    const params = useParams();
    const { id } = params;
    const { addToCart } = useCart();

    const [product, setProduct] = React.useState<ImagePlaceholder | null>(null);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        if (id) {
            const foundProduct = PlaceHolderImages.find(p => p.id === id);
            setProduct(foundProduct || null);
        }
    }, [id]);

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <div className="flex flex-1 items-center justify-center">
                    <p>Producto no encontrado.</p>
                </div>
            </div>
        );
    }
    
    const series = Array.isArray(product.imageHint) ? product.imageHint : [product.imageHint];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto max-w-6xl px-4 py-8">
                <Button variant="link" asChild className="mb-4 pl-0">
                    <Link href="/arte-y-colecciones">
                        &larr; Volver a la tienda
                    </Link>
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <ProductGallery images={product.imageUrls} title={product.title || 'Producto'} />
                    
                    <div className="flex flex-col space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
                            {!product.available && (
                                <Badge variant="destructive">Agotado</Badge>
                            )}
                        </div>

                        <div className="text-3xl font-bold text-primary">
                            {product.price || 'Consultar'}
                        </div>

                        {product.details && (
                            <p className="text-muted-foreground leading-relaxed">
                                {product.details}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {series.map(s => (
                                <Badge key={s} variant="secondary">{s}</Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button 
                                size="lg" 
                                className="flex-1"
                                onClick={() => addToCart(product)}
                                disabled={!product.available}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Añadir al Carrito
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-12 w-12"
                                onClick={() => setIsLiked(!isLiked)}
                                aria-label="Añadir a favoritos"
                            >
                                <Heart className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "")} />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
