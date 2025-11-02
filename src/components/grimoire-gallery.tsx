
'use client';

import * as React from 'react';
import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";

export function GrimoireGallery({ 
  isOpen, 
  onClose, 
  allArtifacts,
  onImageClick 
}: { 
  isOpen: boolean;
  onClose: () => void;
  allArtifacts: ImagePlaceholder[];
  onImageClick: (images: ImagePlaceholder[], startIndex: number) => void;
}) {
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(false);
  const [selectedSeries, setSelectedSeries] = React.useState("all");

  const seriesOptions = React.useMemo(() => {
    const series = new Set<string>();
    allArtifacts.forEach(artifact => {
      if (artifact.imageHint) {
        if (Array.isArray(artifact.imageHint)) {
          artifact.imageHint.forEach(hint => series.add(hint));
        } else {
          series.add(artifact.imageHint);
        }
      }
    });
    const uniqueSeries = Array.from(series);
    return [{ value: "all", label: "Todas las series" }, ...uniqueSeries.map(s => ({ value: s, label: s }))];
  }, [allArtifacts]);

  const filteredArtifacts = React.useMemo(() => {
    let artifacts = allArtifacts;

    if (showOnlyAvailable) {
      artifacts = artifacts.filter(artifact => artifact.available);
    }
    
    if (selectedSeries !== "all") {
      artifacts = artifacts.filter(artifact => {
        if (Array.isArray(artifact.imageHint)) {
          return artifact.imageHint.includes(selectedSeries);
        }
        return artifact.imageHint === selectedSeries;
      });
    }

    return artifacts;
  }, [allArtifacts, showOnlyAvailable, selectedSeries]);

  const handleImageClick = (artifact: ImagePlaceholder) => {
    const listForGallery = filteredArtifacts;
    const startIndex = listForGallery.findIndex(a => a.id === artifact.id);
    onImageClick(listForGallery, startIndex);
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-full p-4">
        <DialogTitle className="sr-only">Códice Resguardado</DialogTitle>
        <h2 className="text-2xl font-bold text-center mb-2">Códice Resguardado</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="available-filter" 
              checked={showOnlyAvailable} 
              onCheckedChange={setShowOnlyAvailable} 
            />
            <Label htmlFor="available-filter">Mostrar solo Canjeables</Label>
          </div>
          <Combobox
            options={seriesOptions}
            selectedValue={selectedSeries}
            onSelectValue={(value) => setSelectedSeries(value || 'all')}
            placeholder="Filtrar por serie..."
            searchPlaceholder="Buscar serie..."
            notFoundMessage="No se encontró la serie."
          />
        </div>
        <ScrollArea className="h-[70vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                {filteredArtifacts.map((image) => (
                    <Card 
                      key={image.id} 
                      className="overflow-hidden cursor-pointer group" 
                      onClick={() => handleImageClick(image)}
                    >
                        <CardContent className="p-0 relative aspect-square">
                            <Image
                                src={image.imageUrls[0]}
                                alt={image.description}
                                fill
                                className={cn(
                                  "object-cover transition-transform duration-300 group-hover:scale-105",
                                  !image.available && "filter tint-green"
                                )}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            {image.price && image.available && (
                              <Badge variant="secondary" className="absolute top-2 left-2 text-primary font-bold">
                                {image.price}
                              </Badge>
                            )}
                            <div className="absolute bottom-0 left-0 p-2 text-white">
                                <h4 className="font-bold text-sm">{image.title}</h4>
                                {!image.available && (
                                  <p className="text-xs text-white/70">Resguardado</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
