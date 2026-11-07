'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, X, Sparkles, ChevronRight, Tag, BookOpen } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FEATURED_FRANCHISES = [
  'Jujutsu Kaisen',
  'One Piece',
  'Demon Slayer: Kimetsu no Yaiba',
  'Chainsaw Man',
  'Naruto',
  'Dragon Ball',
  'Pokémon',
  'Dandadan',
  'One Punch Man',
  'Bocchi the Rock!',
];

// Normalize text for accent-insensitive and case-insensitive search
function normalizeText(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

interface PredictiveSearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  allArtifacts: ImagePlaceholder[];
  onSelectArtifact: (artifact: ImagePlaceholder) => void;
  onOpenGrimoireWithQuery?: (query: string) => void;
  onSelectFranchise?: (franchise: string) => void;
  selectedFranchise?: string;
  className?: string;
}

export function PredictiveSearchBar({
  value,
  onChange,
  onClear,
  allArtifacts = [],
  onSelectArtifact,
  onOpenGrimoireWithQuery,
  onSelectFranchise,
  selectedFranchise = 'all',
  className,
}: PredictiveSearchBarProps) {
  // Support both controlled mode (via value prop) and uncontrolled mode
  const [internalValue, setInternalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const searchValue = (value !== undefined ? value : internalValue) || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (onChange) {
      onChange(newVal);
    } else {
      setInternalValue(newVal);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setInternalValue('');
    }
    inputRef.current?.focus();
  };

  // Close predictive dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute predictive matches in real-time
  const predictiveResults = React.useMemo(() => {
    const trimmed = (searchValue || '').trim();
    if (!trimmed) return [];

    const query = normalizeText(trimmed);
    if (!query) return [];

    const matches = (allArtifacts || []).filter((artifact) => {
      if (!artifact) return false;
      const titleMatch = typeof artifact.title === 'string' ? normalizeText(artifact.title).includes(query) : false;
      const categoryMatch = typeof artifact.category === 'string' ? normalizeText(artifact.category).includes(query) : false;
      const descMatch = typeof artifact.description === 'string' ? normalizeText(artifact.description).includes(query) : false;
      const detailsMatch = typeof artifact.details === 'string' ? normalizeText(artifact.details).includes(query) : false;

      let hintMatch = false;
      if (Array.isArray(artifact.imageHint)) {
        hintMatch = artifact.imageHint.some((hint) => typeof hint === 'string' && normalizeText(hint).includes(query));
      } else if (typeof artifact.imageHint === 'string') {
        hintMatch = normalizeText(artifact.imageHint).includes(query);
      }

      return titleMatch || categoryMatch || descMatch || detailsMatch || hintMatch;
    });

    // Limit to top 6 predictive suggestions
    return matches.slice(0, 6);
  }, [searchValue, allArtifacts]);

  const showPredictivePanel = isFocused && searchValue.trim().length > 0;

  const getFranchiseDisplay = (artifact: ImagePlaceholder): string | null => {
    if (Array.isArray(artifact.imageHint) && artifact.imageHint.length > 0) {
      return String(artifact.imageHint[0]);
    }
    if (typeof artifact.imageHint === 'string' && artifact.imageHint.trim().length > 0) {
      return artifact.imageHint;
    }
    return null;
  };

  const handleOpenGrimoire = () => {
    setIsFocused(false);
    if (onOpenGrimoireWithQuery) {
      onOpenGrimoireWithQuery(searchValue);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full space-y-2', className)}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleOpenGrimoire();
            }
          }}
          placeholder="Buscar por personaje, anime, serie, categoría..."
          className="w-full h-10 pl-10 pr-9 rounded-lg border border-border/70 hover:border-primary/50 focus:border-primary bg-background/80 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
        />
        {searchValue.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Action Franchise Buttons (if onSelectFranchise is provided) */}
      {onSelectFranchise && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar touch-pan-x text-xs">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-primary/90 uppercase tracking-wider shrink-0 pr-1 select-none">
            <Sparkles className="h-3 w-3" /> Series:
          </span>
          {FEATURED_FRANCHISES.map((franchise) => {
            const isSelected = selectedFranchise === franchise;
            const shortName = franchise.replace(': Kimetsu no Yaiba', '');
            return (
              <button
                key={franchise}
                type="button"
                onClick={() => onSelectFranchise(franchise)}
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap shrink-0',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30 scale-[1.02]'
                    : 'bg-secondary/40 hover:bg-secondary/90 text-secondary-foreground border-border/50 hover:border-primary/40'
                )}
              >
                {shortName}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating Predictive Results Panel */}
      {showPredictivePanel && (
        <div className="absolute top-11 left-0 right-0 z-50 mt-1 rounded-xl border border-primary/30 bg-popover/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/40 bg-muted/40 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Coincidencias ({predictiveResults.length})
            </span>
            <span className="text-[11px]">Toca para abrir ficha</span>
          </div>

          {predictiveResults.length > 0 ? (
            <div className="divide-y divide-border/20 max-h-72 overflow-y-auto">
              {predictiveResults.map((artifact) => {
                const franchise = getFranchiseDisplay(artifact);
                return (
                  <div
                    key={artifact.id}
                    onClick={() => {
                      setIsFocused(false);
                      onSelectArtifact(artifact);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-primary/10 cursor-pointer transition group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50 shadow-sm">
                      {artifact.imageUrls && artifact.imageUrls[0] ? (
                        <Image
                          src={artifact.imageUrls[0]}
                          alt={artifact.title || artifact.description || 'Artefacto'}
                          fill
                          sizes="48px"
                          className={cn(
                            'object-cover transition-transform duration-300 group-hover:scale-105',
                            !artifact.available && 'tint-green'
                          )}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          水
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {artifact.title || artifact.description}
                      </h5>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {franchise && (
                          <span className="text-[11px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                            {franchise}
                          </span>
                        )}
                        {artifact.category && (
                          <span className="text-[10px] text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded capitalize">
                            {artifact.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price or Resguardado Status */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      {artifact.available && artifact.price ? (
                        <Badge variant="outline" className="border-primary/50 text-primary font-bold text-xs bg-primary/5">
                          {artifact.price}
                        </Badge>
                      ) : !artifact.available ? (
                        <Badge variant="secondary" className="text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                          Resguardado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Canjeable
                        </Badge>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}

              <div className="p-2 bg-muted/20 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-primary hover:text-primary hover:bg-primary/10 h-8 gap-1.5"
                  onClick={handleOpenGrimoire}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Ver todos los resultados en el Grimorio
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <Tag className="h-6 w-6 mx-auto mb-2 opacity-40 text-primary" />
              <p className="font-medium text-foreground">Sin coincidencias para &quot;{searchValue}&quot;</p>
              <p className="text-xs text-muted-foreground mt-1">
                Prueba buscando otro personaje, anime o palabra clave.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
