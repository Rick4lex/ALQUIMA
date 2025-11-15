'use client';

import * as React from 'react';
import type { Filters } from '@/app/arte-y-colecciones/page';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

type FilterSidebarProps = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    categoryOptions: { value: string; label: string }[];
    seriesOptions: { value: string; label: string }[];
    maxPrice: number;
};

export function FilterSidebar({ filters, setFilters, categoryOptions, seriesOptions, maxPrice }: FilterSidebarProps) {

    const handleCategoryChange = (categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(c => c !== categoryId)
                : [...prev.categories, categoryId],
        }));
    };

    const handleSeriesChange = (seriesId: string) => {
        setFilters(prev => ({
            ...prev,
            series: prev.series.includes(seriesId)
                ? prev.series.filter(s => s !== seriesId)
                : [...prev.series, seriesId],
        }));
    };

    const handlePriceChange = (newRange: [number, number]) => {
        setFilters(prev => ({ ...prev, priceRange: newRange }));
    };

    const handleAvailabilityChange = (checked: boolean) => {
        setFilters(prev => ({ ...prev, showAvailableOnly: checked }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Categorías</h3>
                <div className="space-y-3">
                    {categoryOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${option.value}`}
                                checked={filters.categories.includes(option.value)}
                                onCheckedChange={() => handleCategoryChange(option.value)}
                            />
                            <Label htmlFor={`cat-${option.value}`} className="cursor-pointer">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

             <div>
                <h3 className="text-lg font-semibold mb-4">Series</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {seriesOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`series-${option.value}`}
                                checked={filters.series.includes(option.value)}
                                onCheckedChange={() => handleSeriesChange(option.value)}
                            />
                            <Label htmlFor={`series-${option.value}`} className="cursor-pointer">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4">Disponibilidad</h3>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="availability-switch"
                        checked={filters.showAvailableOnly}
                        onCheckedChange={handleAvailabilityChange}
                    />
                    <Label htmlFor="availability-switch">Mostrar solo disponibles</Label>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4">Rango de Precios</h3>
                <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handlePriceChange(value as [number, number])}
                    max={maxPrice}
                    step={1000}
                    min={0}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${filters.priceRange[0].toLocaleString('es-CO')}</span>
                    <span>${filters.priceRange[1].toLocaleString('es-CO')}</span>
                </div>
            </div>
        </div>
    );
}
