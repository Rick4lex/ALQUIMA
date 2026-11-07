'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X, Search, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface SeriesOption {
  value: string;
  label: string;
  count?: number;
}

interface SeriesMultiSelectProps {
  options: SeriesOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function SeriesMultiSelect({
  options,
  selectedValues,
  onChange,
  className,
  placeholder = 'Todas las series...',
}: SeriesMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleSelectAll = () => {
    const allValues = filteredOptions.map((o) => o.value);
    // Combine existing with newly selected filtered options
    const merged = Array.from(new Set([...selectedValues, ...allValues]));
    onChange(merged);
  };

  const handleClear = () => {
    onChange([]);
  };

  // Determine trigger label
  const triggerLabel = React.useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.value === selectedValues[0]);
      return match ? match.label : selectedValues[0];
    }
    return `${selectedValues.length} series seleccionadas`;
  }, [selectedValues, options, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full h-8 justify-between text-xs px-2.5 bg-background/80 hover:bg-background border-input',
            selectedValues.length > 0 && 'border-primary/50 text-foreground',
            className
          )}
        >
          <span className="truncate text-left flex-1 mr-1">
            {triggerLabel}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {selectedValues.length > 0 && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] bg-primary/15 text-primary border border-primary/30"
              >
                {selectedValues.length}
              </Badge>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-72 p-0 z-[80] bg-popover/98 backdrop-blur-xl border border-primary/30 shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Search Input Box inside Dropdown */}
        <div className="p-2 border-b border-border/40 bg-muted/30">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serie o anime..."
              className="w-full h-8 pl-8 pr-7 text-xs rounded-md bg-background border border-border/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between text-[11px] pt-1.5 px-0.5 text-muted-foreground">
            <button
              type="button"
              onClick={handleSelectAll}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <CheckSquare className="h-3 w-3" /> Seleccionar todo
            </button>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-destructive hover:underline flex items-center gap-1"
              >
                <Square className="h-3 w-3" /> Limpiar ({selectedValues.length})
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Checkbox List */}
        <ScrollArea className="max-h-60 p-1">
          {filteredOptions.length > 0 ? (
            <div className="space-y-0.5 p-1">
              {filteredOptions.map((option) => {
                const isChecked = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      'flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors select-none',
                      isChecked
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/70 text-foreground'
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleOption(option.value)}
                      className="h-3.5 w-3.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-[10px] text-muted-foreground shrink-0 px-1 py-0.2 rounded bg-muted">
                        {option.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No se encontraron series para &quot;{searchQuery}&quot;
            </div>
          )}
        </ScrollArea>

        {/* Footer Bar */}
        <div className="p-2 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-muted-foreground">
            {selectedValues.length} de {options.length} activas
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="h-6 text-xs px-2 text-primary hover:bg-primary/10"
          >
            Listo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
