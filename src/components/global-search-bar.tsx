'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Sparkles,
  Layers,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type FilterState,
  type PriceRangePreset,
  type SortOption,
  getSeriesList,
  matchesSearchQuery,
  parsePrice,
} from '@/lib/catalog-utils';
import { grimoireCategories } from '@/lib/pagedata';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface GlobalSearchBarProps {
  artifacts: ImagePlaceholder[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSelectArtifact: (artifact: ImagePlaceholder) => void;
  onViewAllResults?: () => void;
  className?: string;
}

export function GlobalSearchBar({
  artifacts,
  filters,
  onFilterChange,
  onSelectArtifact,
  onViewAllResults,
  className,
}: GlobalSearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Popular anime / franchise recommendations for instant 1-click search
  const popularKeywords = React.useMemo(() => {
    return [
      'One Piece',
      'Jujutsu Kaisen',
      'Chainsaw Man',
      'One Punch Man',
      'Kimetsu no Yaiba',
      'Dragon Ball',
      'Minifiguras',
      'Stickers',
    ];
  }, []);

  // All detected unique series for the series dropdown
  const allSeries = React.useMemo(() => {
    const set = new Set<string>();
    artifacts.forEach(item => {
      getSeriesList(item).forEach(s => {
        if (s && s !== 'Alquima 水') set.add(s);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [artifacts]);

  // Live predictive suggestions matching current text query
  const predictiveSuggestions = React.useMemo(() => {
    if (!filters.searchQuery.trim()) return [];
    return artifacts
      .filter(item => matchesSearchQuery(item, filters.searchQuery))
      .slice(0, 5);
  }, [artifacts, filters.searchQuery]);

  const totalMatchesCount = React.useMemo(() => {
    if (!filters.searchQuery.trim()) return 0;
    return artifacts.filter(item => matchesSearchQuery(item, filters.searchQuery)).length;
  }, [artifacts, filters.searchQuery]);

  // Handle clicking outside to close predictive dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQueryChange = (value: string) => {
    onFilterChange({
      ...filters,
      searchQuery: value,
    });
  };

  const handleClearQuery = () => {
    onFilterChange({
      ...filters,
      searchQuery: '',
    });
  };

  const handleQuickKeywordClick = (keyword: string) => {
    onFilterChange({
      ...filters,
      searchQuery: keyword,
    });
    setIsFocused(false);
    onViewAllResults?.();
  };

  const handleResetFilters = () => {
    onFilterChange({
      searchQuery: '',
      category: 'all',
      series: 'all',
      onlyAvailable: false,
      priceRange: 'all',
      sortBy: 'featured',
      customMinPrice: undefined,
      customMaxPrice: undefined,
    });
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.category !== 'all' ||
    filters.series !== 'all' ||
    filters.onlyAvailable ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'featured';

  const sortLabels: Record<SortOption, string> = {
    featured: 'Destacados',
    'price-asc': 'Precio: Menor a Mayor',
    'price-desc': 'Precio: Mayor a Menor',
    'name-asc': 'Nombre: A - Z',
    'name-desc': 'Nombre: Z - A',
    'available-first': 'Disponibles primero',
  };

  const priceRangeLabels: Record<PriceRangePreset, string> = {
    all: 'Cualquier precio',
    'under-10k': 'Hasta $10.000',
    '10k-20k': '$10.000 a $20.000',
    'over-20k': 'Más de $20.000',
    custom: 'Rango personalizado',
  };

  return (
    <div className={cn('w-full relative z-30', className)} ref={searchContainerRef}>
      {/* Search Input Box */}
      <div className="relative group">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
          <Input
            type="text"
            value={filters.searchQuery}
            onChange={e => handleQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Buscar por anime, figura, serie (ej: One Piece, Jujutsu, madera...)"
            className="pl-10 pr-24 h-12 bg-card border-border/80 focus-visible:ring-primary/40 text-sm md:text-base shadow-sm rounded-xl transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearQuery}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant={showFiltersPanel ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={cn(
                'h-8 px-2.5 text-xs font-medium rounded-lg gap-1.5 transition-colors',
                (filters.category !== 'all' ||
                  filters.series !== 'all' ||
                  filters.onlyAvailable ||
                  filters.priceRange !== 'all' ||
                  filters.sortBy !== 'featured') &&
                  'text-primary font-semibold'
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filtros</span>
              {(filters.category !== 'all' ||
                filters.series !== 'all' ||
                filters.onlyAvailable ||
                filters.priceRange !== 'all') && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </div>
        </div>

        {/* Predictive Suggestions Dropdown */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/80 rounded-xl shadow-xl overflow-hidden backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* If user is typing query */}
            {filters.searchQuery.trim().length > 0 ? (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <span>Sugerencias para &ldquo;{filters.searchQuery}&rdquo;</span>
                  <span>{totalMatchesCount} encontrados</span>
                </div>

                {predictiveSuggestions.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {predictiveSuggestions.map(item => {
                      const seriesList = getSeriesList(item);
                      const parsed = parsePrice(item.price);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectArtifact(item);
                            setIsFocused(false);
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors group/item"
                        >
                          <div className="relative h-11 w-11 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                            <Image
                              src={item.imageUrls[0]}
                              alt={item.title || item.description}
                              fill
                              className={cn(
                                'object-cover group-hover/item:scale-105 transition-transform duration-200',
                                !item.available && 'tint-green'
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium truncate text-foreground group-hover/item:text-primary transition-colors">
                              {item.title || item.description}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {seriesList.length > 0 && (
                                <span className="truncate max-w-[140px] text-primary/80 font-medium">
                                  {seriesList[0]}
                                </span>
                              )}
                              {seriesList.length > 0 && item.category && <span>·</span>}
                              {item.category && (
                                <span className="capitalize">{item.category}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {item.available && item.price ? (
                              <span className="text-xs font-bold text-primary tabular-nums">
                                {item.price}
                              </span>
                            ) : !item.available ? (
                              <span className="text-[11px] text-muted-foreground/80 font-medium">
                                Resguardado
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}

                    {totalMatchesCount > predictiveSuggestions.length && (
                      <div className="pt-2 px-1 border-t border-border/50 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsFocused(false);
                            onViewAllResults?.();
                          }}
                          className="w-full justify-center text-xs text-primary font-semibold h-8"
                        >
                          Ver los {totalMatchesCount} resultados en el catálogo
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No se encontraron artefactos con &ldquo;{filters.searchQuery}&rdquo;.
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Intenta buscar por franquicia: One Piece, Jujutsu Kaisen, Dragon Ball...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* When query is empty but focused: show fast keyword pills */
              <div className="p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Búsquedas populares de anime y coleccionables</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularKeywords.map(keyword => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => handleQuickKeywordClick(keyword)}
                      className="px-2.5 py-1 text-xs rounded-full bg-secondary/80 hover:bg-primary/20 hover:text-primary text-secondary-foreground transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Advanced Filters and Sorting Panel */}
      {showFiltersPanel && (
        <div className="mt-3 p-4 bg-card/95 border border-border rounded-xl shadow-md space-y-4 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              Filtros y Ordenamiento
            </h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Restablecer todo
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Ordenamiento */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" /> Ordenar por
              </Label>
              <Select
                value={filters.sortBy}
                onValueChange={(val: SortOption) =>
                  onFilterChange({ ...filters, sortBy: val })
                }
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name-asc">Nombre: A - Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z - A</SelectItem>
                  <SelectItem value="available-first">Disponibles primero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Rango de Precios */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" /> Rango de Precios
              </Label>
              <Select
                value={filters.priceRange}
                onValueChange={(val: PriceRangePreset) =>
                  onFilterChange({ ...filters, priceRange: val })
                }
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder="Filtrar por precio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier precio</SelectItem>
                  <SelectItem value="under-10k">Hasta $10.000</SelectItem>
                  <SelectItem value="10k-20k">$10.000 a $20.000</SelectItem>
                  <SelectItem value="over-20k">Más de $20.000</SelectItem>
                  <SelectItem value="custom">Rango personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Categoría */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" /> Categoría
              </Label>
              <Select
                value={filters.category}
                onValueChange={(val: string) =>
                  onFilterChange({ ...filters, category: val })
                }
              >
                <SelectTrigger className="h-9 text-xs bg-background capitalize">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {grimoireCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Franquicia / Serie */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Serie / Anime
              </Label>
              <Select
                value={filters.series}
                onValueChange={(val: string) =>
                  onFilterChange({ ...filters, series: val })
                }
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder="Todas las series" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  <SelectItem value="all">Todas las series</SelectItem>
                  {allSeries.map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Price Inputs (when 'custom' preset is selected) */}
          {filters.priceRange === 'custom' && (
            <div className="p-3 bg-muted/40 rounded-lg flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                Rango personalizado (COP):
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  type="number"
                  placeholder="Mín ($)"
                  value={filters.customMinPrice ?? ''}
                  onChange={e =>
                    onFilterChange({
                      ...filters,
                      customMinPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-8 text-xs bg-background w-28"
                  min={0}
                  step={1000}
                />
                <span className="text-xs text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Máx ($)"
                  value={filters.customMaxPrice ?? ''}
                  onChange={e =>
                    onFilterChange({
                      ...filters,
                      customMaxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-8 text-xs bg-background w-28"
                  min={0}
                  step={1000}
                />
              </div>
            </div>
          )}

          {/* Availability switch & Quick active tags summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Switch
                id="only-available-filter"
                checked={filters.onlyAvailable}
                onCheckedChange={checked =>
                  onFilterChange({ ...filters, onlyAvailable: checked })
                }
              />
              <Label
                htmlFor="only-available-filter"
                className="text-xs font-medium cursor-pointer"
              >
                Mostrar solo Canjeables (en stock)
              </Label>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              Orden actual: <span className="text-foreground">{sortLabels[filters.sortBy]}</span>
              {filters.priceRange !== 'all' && (
                <>
                  <span className="mx-1.5">·</span>
                  <span>{priceRangeLabels[filters.priceRange]}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
