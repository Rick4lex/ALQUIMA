'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  X,
  FilterX,
  SlidersHorizontal,
  ArrowUpDown,
  DollarSign,
  PackageCheck,
  Sparkles,
  ArrowUp,
  Check,
  Eye,
} from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';
import { PredictiveSearchBar } from '@/components/predictive-search-bar';
import { ArtifactSheet } from '@/components/artifact-sheet';

// Helper to parse price string (e.g. "12.000 und") into integer number (12000)
function parsePriceToNumber(priceStr?: string): number {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

// Normalize text for accent-insensitive and case-insensitive comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export type PriceRangeType = 'all' | 'under-10k' | '10k-20k' | 'over-20k';
export type SortOptionType = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const PRICE_LABELS: Record<PriceRangeType, string> = {
  all: 'Cualquier precio',
  'under-10k': 'Hasta $10.000 COP',
  '10k-20k': '$10.000 a $20.000 COP',
  'over-20k': 'Más de $20.000 COP',
};

const SORT_LABELS: Record<SortOptionType, string> = {
  default: 'Destacados / Defecto',
  'price-asc': 'Precio: Menor a Mayor',
  'price-desc': 'Precio: Mayor a Menor',
  'name-asc': 'Nombre: A - Z',
  'name-desc': 'Nombre: Z - A',
};

export function GrimoireGallery({
  isOpen,
  onClose,
  allArtifacts,
  onImageClick,
  initialSearchQuery,
}: {
  isOpen: boolean;
  onClose: () => void;
  allArtifacts: ImagePlaceholder[];
  onImageClick: (images: ImagePlaceholder[], startIndex: number) => void;
  initialSearchQuery?: string;
}) {
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery || '');
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(false);
  const [selectedSeries, setSelectedSeries] = React.useState('all');
  const [priceRange, setPriceRange] = React.useState<PriceRangeType>('all');
  const [sortBy, setSortBy] = React.useState<SortOptionType>('default');

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [activeArtifactForSheet, setActiveArtifactForSheet] = React.useState<ImagePlaceholder | null>(null);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Build series options from artifacts' imageHint
  const seriesOptions = React.useMemo(() => {
    const seriesSet = new Set<string>();
    allArtifacts.forEach((artifact) => {
      if (artifact.imageHint) {
        if (Array.isArray(artifact.imageHint)) {
          artifact.imageHint.forEach((hint) => seriesSet.add(hint));
        } else {
          seriesSet.add(artifact.imageHint);
        }
      }
    });
    const uniqueSeries = Array.from(seriesSet).sort((a, b) => a.localeCompare(b));
    return [
      { value: 'all', label: 'Todas las series' },
      ...uniqueSeries.map((s) => ({ value: s, label: s })),
    ];
  }, [allArtifacts]);

  // Combined real-time filtering & sorting
  const filteredArtifacts = React.useMemo(() => {
    let artifacts = [...allArtifacts];

    // 1. Availability filter
    if (showOnlyAvailable) {
      artifacts = artifacts.filter((artifact) => artifact.available);
    }

    // 2. Series / Anime filter
    if (selectedSeries !== 'all') {
      artifacts = artifacts.filter((artifact) => {
        if (Array.isArray(artifact.imageHint)) {
          return artifact.imageHint.includes(selectedSeries);
        }
        return artifact.imageHint === selectedSeries;
      });
    }

    // 3. Search query filter
    if (searchQuery.trim().length > 0) {
      const q = normalizeText(searchQuery.trim());
      artifacts = artifacts.filter((artifact) => {
        const titleMatch = artifact.title ? normalizeText(artifact.title).includes(q) : false;
        const categoryMatch = artifact.category ? normalizeText(artifact.category).includes(q) : false;
        const descMatch = artifact.description ? normalizeText(artifact.description).includes(q) : false;
        const detailsMatch = artifact.details ? normalizeText(artifact.details).includes(q) : false;

        let hintMatch = false;
        if (Array.isArray(artifact.imageHint)) {
          hintMatch = artifact.imageHint.some((hint) => normalizeText(hint).includes(q));
        } else if (artifact.imageHint) {
          hintMatch = normalizeText(artifact.imageHint).includes(q);
        }

        return titleMatch || categoryMatch || descMatch || detailsMatch || hintMatch;
      });
    }

    // 4. Price range filter
    if (priceRange === 'under-10k') {
      artifacts = artifacts.filter((artifact) => {
        const price = parsePriceToNumber(artifact.price);
        return price > 0 && price <= 10000;
      });
    } else if (priceRange === '10k-20k') {
      artifacts = artifacts.filter((artifact) => {
        const price = parsePriceToNumber(artifact.price);
        return price >= 10000 && price <= 20000;
      });
    } else if (priceRange === 'over-20k') {
      artifacts = artifacts.filter((artifact) => {
        const price = parsePriceToNumber(artifact.price);
        return price > 20000;
      });
    }

    // 5. Sorting
    if (sortBy === 'price-asc') {
      artifacts.sort((a, b) => {
        const pa = parsePriceToNumber(a.price);
        const pb = parsePriceToNumber(b.price);
        if (pa === 0 && pb !== 0) return 1;
        if (pa !== 0 && pb === 0) return -1;
        return pa - pb;
      });
    } else if (sortBy === 'price-desc') {
      artifacts.sort((a, b) => {
        const pa = parsePriceToNumber(a.price);
        const pb = parsePriceToNumber(b.price);
        return pb - pa;
      });
    } else if (sortBy === 'name-asc') {
      artifacts.sort((a, b) => (a.title || a.description || '').localeCompare(b.title || b.description || ''));
    } else if (sortBy === 'name-desc') {
      artifacts.sort((a, b) => (b.title || b.description || '').localeCompare(a.title || a.description || ''));
    }

    return artifacts;
  }, [allArtifacts, showOnlyAvailable, selectedSeries, searchQuery, priceRange, sortBy]);

  // Click on a grid card opens full gallery mode
  const handleGridCardClick = (artifact: ImagePlaceholder) => {
    const listForGallery = filteredArtifacts;
    const startIndex = listForGallery.findIndex((a) => a.id === artifact.id);
    onImageClick(listForGallery, startIndex >= 0 ? startIndex : 0);
  };

  // Quick franchise toggle
  const handleFranchiseSelect = (franchise: string) => {
    if (selectedSeries === franchise) {
      setSelectedSeries('all');
    } else {
      setSelectedSeries(franchise);
    }
  };

  // Reset all filters to default
  const clearAllFilters = () => {
    setSearchQuery('');
    setShowOnlyAvailable(false);
    setSelectedSeries('all');
    setPriceRange('all');
    setSortBy('default');
  };

  // Scroll smoothly back to top of the grid
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Listen to viewport scroll to show/hide "Volver arriba" button
  React.useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const viewport = scrollContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!viewport) return;

      const handleScroll = () => {
        setShowScrollTop(viewport.scrollTop > 280);
      };

      viewport.addEventListener('scroll', handleScroll, { passive: true });
      return () => viewport.removeEventListener('scroll', handleScroll);
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Count active filter criteria
  const activeFiltersCount =
    (searchQuery.trim().length > 0 ? 1 : 0) +
    (showOnlyAvailable ? 1 : 0) +
    (selectedSeries !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 flex flex-col w-[96vw] max-w-7xl h-[92vh] max-h-[92vh] translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-2xl shadow-2xl text-foreground">
          <DialogTitle className="sr-only">Códice Resguardado</DialogTitle>

          {/* ================= FIXED HEADER SECTION ================= */}
          <header className="shrink-0 border-b border-border/40 px-4 pt-3.5 pb-2.5 space-y-2.5 bg-card/60 backdrop-blur-md z-30">
            {/* Top Bar: Title, Count Badge, Close */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl font-black text-primary leading-none select-none">水</span>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground truncate flex items-center gap-2">
                    Códice Resguardado
                    <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-semibold border-primary/40 text-primary px-2 py-0.5">
                      {filteredArtifacts.length} de {allArtifacts.length} piezas
                    </Badge>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground sm:hidden font-medium">
                  {filteredArtifacts.length} piezas
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                  aria-label="Cerrar modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Predictive Search Bar with Franchise Chips */}
            <PredictiveSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              allArtifacts={allArtifacts}
              onSelectArtifact={(artifact) => setActiveArtifactForSheet(artifact)}
              onSelectFranchise={handleFranchiseSelect}
              selectedFranchise={selectedSeries}
            />

            {/* Controls Bar: Responsive Toggle on Mobile, Full Grid on Desktop */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              {/* Mobile Filter Toggle Button */}
              <div className="flex sm:hidden items-center gap-2 w-full">
                <Button
                  variant={showMobileFilters ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowMobileFilters((prev) => !prev)}
                  className="flex-1 h-8 text-xs font-medium justify-between border-border/60"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filtros y Ajustes
                  </span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="h-4 px-1 text-[10px] font-bold bg-primary text-primary-foreground">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {/* Compact Sort Select on Mobile */}
                <div className="w-[140px] shrink-0">
                  <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val as SortOptionType)}
                  >
                    <SelectTrigger className="h-8 text-[11px] border-border/60">
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      <SelectItem value="default" className="text-xs">Destacados</SelectItem>
                      <SelectItem value="price-asc" className="text-xs">Precio: Menor</SelectItem>
                      <SelectItem value="price-desc" className="text-xs">Precio: Mayor</SelectItem>
                      <SelectItem value="name-asc" className="text-xs">Nombre: A - Z</SelectItem>
                      <SelectItem value="name-desc" className="text-xs">Nombre: Z - A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Desktop Filters Row (or expanded on Mobile) */}
              <div
                className={cn(
                  'w-full grid-cols-1 sm:grid-cols-4 gap-2 text-xs transition-all duration-200',
                  showMobileFilters ? 'grid pt-1 pb-1 border-t border-border/30' : 'hidden sm:grid'
                )}
              >
                {/* Series / Anime Dropdown */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" /> Serie / Anime
                  </Label>
                  <Combobox
                    options={seriesOptions}
                    selectedValue={selectedSeries}
                    onSelectValue={(value) => setSelectedSeries(value || 'all')}
                    placeholder="Todas las series..."
                    searchPlaceholder="Buscar serie..."
                    notFoundMessage="No se encontró la serie."
                    className="w-full h-8 text-xs bg-background/80"
                  />
                </div>

                {/* Price Range Dropdown */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-primary" /> Precio
                  </Label>
                  <Select
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as PriceRangeType)}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/80">
                      <SelectValue placeholder="Rango de precio" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      <SelectItem value="all" className="text-xs">Cualquier precio</SelectItem>
                      <SelectItem value="under-10k" className="text-xs">Hasta $10.000 COP</SelectItem>
                      <SelectItem value="10k-20k" className="text-xs">$10.000 a $20.000 COP</SelectItem>
                      <SelectItem value="over-20k" className="text-xs">Más de $20.000 COP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sorting Dropdown (Desktop) */}
                <div className="space-y-1 hidden sm:block">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3 text-primary" /> Orden
                  </Label>
                  <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val as SortOptionType)}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/80">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      <SelectItem value="default" className="text-xs">Destacados / Defecto</SelectItem>
                      <SelectItem value="price-asc" className="text-xs">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-desc" className="text-xs">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="name-asc" className="text-xs">Nombre: A - Z</SelectItem>
                      <SelectItem value="name-desc" className="text-xs">Nombre: Z - A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Switch */}
                <div className="space-y-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between h-8 px-2.5 rounded-md border border-input bg-background/80">
                    <div className="flex items-center space-x-1.5">
                      <PackageCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <Label htmlFor="available-filter" className="text-xs font-medium cursor-pointer">
                        Solo Canjeables
                      </Label>
                    </div>
                    <Switch
                      id="available-filter"
                      checked={showOnlyAvailable}
                      onCheckedChange={setShowOnlyAvailable}
                      aria-label="Filtrar por artículos disponibles"
                      className="scale-90"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="h-3 w-3" /> Activos:
                </span>

                {searchQuery.trim().length > 0 && (
                  <Badge variant="secondary" className="gap-1 text-[11px] pl-2 pr-1 py-0.5 bg-primary/10 text-primary border border-primary/30">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition"
                      aria-label="Eliminar filtro de búsqueda"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {selectedSeries !== 'all' && (
                  <Badge variant="secondary" className="gap-1 text-[11px] pl-2 pr-1 py-0.5">
                    Serie: {selectedSeries}
                    <button
                      type="button"
                      onClick={() => setSelectedSeries('all')}
                      className="hover:bg-muted rounded-full p-0.5 transition"
                      aria-label="Eliminar filtro de serie"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {priceRange !== 'all' && (
                  <Badge variant="secondary" className="gap-1 text-[11px] pl-2 pr-1 py-0.5">
                    {PRICE_LABELS[priceRange]}
                    <button
                      type="button"
                      onClick={() => setPriceRange('all')}
                      className="hover:bg-muted rounded-full p-0.5 transition"
                      aria-label="Eliminar filtro de precio"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {showOnlyAvailable && (
                  <Badge variant="secondary" className="gap-1 text-[11px] pl-2 pr-1 py-0.5 border border-emerald-500/40 bg-emerald-950/20 text-emerald-400">
                    Solo Canjeables
                    <button
                      type="button"
                      onClick={() => setShowOnlyAvailable(false)}
                      className="hover:bg-emerald-900/40 rounded-full p-0.5 transition"
                      aria-label="Eliminar filtro de disponibles"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {sortBy !== 'default' && (
                  <Badge variant="secondary" className="gap-1 text-[11px] pl-2 pr-1 py-0.5">
                    {SORT_LABELS[sortBy]}
                    <button
                      type="button"
                      onClick={() => setSortBy('default')}
                      className="hover:bg-muted rounded-full p-0.5 transition"
                      aria-label="Eliminar filtro de orden"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-5 text-[11px] px-2 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                >
                  <FilterX className="h-3 w-3 mr-1" /> Limpiar todo
                </Button>
              </div>
            )}
          </header>

          {/* ================= CONTINUOUS SCROLL AREA ================= */}
          <div ref={scrollContainerRef} className="flex-1 min-h-0 w-full relative overflow-hidden bg-background/40">
            <ScrollArea className="h-full w-full">
              <div className="p-3 sm:p-4 md:p-5">
                {filteredArtifacts.length > 0 ? (
                  <>
                    {/* Responsive Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
                      {filteredArtifacts.map((image) => {
                        const franchise = Array.isArray(image.imageHint)
                          ? image.imageHint[0]
                          : typeof image.imageHint === 'string'
                          ? image.imageHint
                          : null;

                        return (
                          <Card
                            key={image.id}
                            className="group relative overflow-hidden cursor-pointer rounded-xl border border-border/60 hover:border-primary/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bg-card/80 select-none"
                            onClick={() => handleGridCardClick(image)}
                          >
                            <CardContent className="p-0 relative aspect-[4/5] overflow-hidden">
                              {/* Product Artwork Image */}
                              <Image
                                src={image.imageUrls[0]}
                                alt={image.title || image.description}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className={cn(
                                  'object-cover transition-transform duration-500 ease-out group-hover:scale-105',
                                  !image.available && 'filter tint-green'
                                )}
                              />

                              {/* Subtle Scrim Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 opacity-75 group-hover:opacity-90 transition-opacity" />

                              {/* Top Bar: Price / Status Badge & Franchise Pill */}
                              <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none z-10">
                                {image.available && image.price ? (
                                  <Badge className="bg-black/75 backdrop-blur-md text-primary font-bold text-[11px] px-2 py-0.5 border border-primary/40 shadow-md">
                                    {image.price}
                                  </Badge>
                                ) : !image.available ? (
                                  <Badge variant="secondary" className="bg-emerald-950/80 backdrop-blur-md text-emerald-300 font-medium text-[10px] px-2 py-0.5 border border-emerald-500/40 shadow-md">
                                    Resguardado
                                  </Badge>
                                ) : (
                                  <span />
                                )}

                                {franchise && (
                                  <span className="text-[10px] font-semibold text-white/90 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/20 truncate max-w-[110px] shadow">
                                    {franchise}
                                  </span>
                                )}
                              </div>

                              {/* Bottom Details Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 text-white z-10 space-y-1">
                                <h4 className="font-bold text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors text-shadow">
                                  {image.title || image.description}
                                </h4>

                                <div className="flex items-center justify-between text-[11px] text-white/70 pt-0.5">
                                  <span className="capitalize text-[10px] text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                                    {image.category || 'Colección'}
                                  </span>
                                  <span className="text-[11px] text-primary font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                    <Eye className="h-3 w-3" /> Ver
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* End of Codex Marker */}
                    <div className="mt-8 mb-4 text-center py-6 border-t border-border/30 space-y-2">
                      <p className="text-xs text-primary/80 font-bold tracking-widest uppercase">
                        ▽△ Códice Explorado ▽△
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mostrando todas las {filteredArtifacts.length} piezas coincidentes
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToTop}
                        className="text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5 h-8 mt-1"
                      >
                        <ArrowUp className="h-3.5 w-3.5" /> Volver arriba
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 space-y-3">
                    <div className="p-3.5 rounded-full bg-muted/60 text-muted-foreground border border-border/60">
                      <FilterX className="h-8 w-8 text-primary/70" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">No se encontraron artefactos</h3>
                    <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                      Ninguna pieza coincide con los filtros aplicados. Prueba ajustando el rango de precio, cambiando la serie o limpiando la búsqueda.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="mt-2 text-xs border-primary/40 text-primary hover:bg-primary/10"
                    >
                      Restablecer todos los filtros
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Floating "Volver Arriba" (Scroll to top) FAB Button */}
            {showScrollTop && (
              <Button
                variant="default"
                size="icon"
                onClick={scrollToTop}
                className="absolute bottom-4 right-4 z-40 h-10 w-10 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 animate-in fade-in-0 zoom-in-95 hover:scale-110"
                aria-label="Volver arriba en el catálogo"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Embedded ArtifactSheet when selected directly from Predictive Search */}
      {activeArtifactForSheet && (
        <ArtifactSheet
          image={activeArtifactForSheet}
          onClose={() => setActiveArtifactForSheet(null)}
        />
      )}
    </>
  );
}
