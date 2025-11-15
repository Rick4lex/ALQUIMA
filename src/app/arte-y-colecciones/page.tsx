
'use client';

import * as React from 'react';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { grimoireCategories } from '@/lib/pagedata';
import { StoreProductCard } from '@/components/store-product-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Filters = {
    search: string;
    categories: string[];
    series: string[];
    priceRange: [number, number];
    showAvailableOnly: boolean;
};

export default function ArteYColeccionesPage() {
    const [filters, setFilters] = React.useState<Filters>({
        search: '',
        categories: [],
        series: [],
        priceRange: [0, 50000],
        showAvailableOnly: true,
    });

    const allProducts = React.useMemo(() => PlaceHolderImages.filter(p => p.category), []);

    const { categoryOptions, seriesOptions, maxPrice } = React.useMemo(() => {
        const categories = new Set<string>();
        const series = new Set<string>();
        let maxPrice = 0;

        allProducts.forEach(p => {
            if (p.category) categories.add(p.category);
            if (p.imageHint) {
                if (Array.isArray(p.imageHint)) {
                    p.imageHint.forEach(s => series.add(s));
                } else {
                    series.add(p.imageHint);
                }
            }
            if (p.price) {
                const priceNum = parseInt(p.price.replace(/\D/g, ''), 10);
                if (!isNaN(priceNum) && priceNum > maxPrice) {
                    maxPrice = priceNum;
                }
            }
        });
        
        const categoryMap = grimoireCategories.reduce((acc, cat) => {
            acc[cat.id] = cat.title;
            return acc;
        }, {} as Record<string, string>);

        return {
            categoryOptions: Array.from(categories).map(c => ({ value: c, label: categoryMap[c] || c })),
            seriesOptions: Array.from(series).map(s => ({ value: s, label: s })),
            maxPrice: maxPrice > 0 ? maxPrice : 50000,
        };
    }, [allProducts]);
    
    React.useEffect(() => {
        setFilters(f => ({ ...f, priceRange: [f.priceRange[0], maxPrice] }));
    }, [maxPrice]);


    const filteredProducts = React.useMemo(() => {
        return allProducts.filter(product => {
            // Search filter
            if (filters.search && !product.title?.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category || '')) {
                return false;
            }
             // Series filter
            if (filters.series.length > 0) {
                const productSeries = Array.isArray(product.imageHint) ? product.imageHint : [product.imageHint];
                if (!filters.series.some(s => productSeries.includes(s))) {
                    return false;
                }
            }
            // Availability filter
            if (filters.showAvailableOnly && !product.available) {
                return false;
            }
            // Price filter
            const priceNum = product.price ? parseInt(product.price.replace(/\D/g, ''), 10) : 0;
            if (isNaN(priceNum) && product.price) return true; // Keep items with non-numeric price like "Consultar"
            if (priceNum < filters.priceRange[0] || priceNum > filters.priceRange[1]) {
                return false;
            }

            return true;
        });
    }, [allProducts, filters]);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                 <h1 className="text-3xl font-bold text-center mb-8">Arte y Colecciones</h1>
                <div className="md:hidden mb-4">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="p-4">
                                <FilterSidebar 
                                    filters={filters}
                                    setFilters={setFilters}
                                    categoryOptions={categoryOptions}
                                    seriesOptions={seriesOptions}
                                    maxPrice={maxPrice}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                        <div className="sticky top-24">
                           <ScrollArea className="h-[calc(100vh-7rem)]">
                                <FilterSidebar 
                                    filters={filters}
                                    setFilters={setFilters}
                                    categoryOptions={categoryOptions}
                                    seriesOptions={seriesOptions}
                                    maxPrice={maxPrice}
                                />
                            </ScrollArea>
                        </div>
                    </aside>
                    <main className="w-full md:w-3/4 lg:w-4/5">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <StoreProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                <p className="text-xl font-semibold">No se encontraron productos</p>
                                <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
