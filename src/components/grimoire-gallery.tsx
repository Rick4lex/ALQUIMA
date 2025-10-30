
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

  const filteredArtifacts = React.useMemo(() => {
    if (showOnlyAvailable) {
      return allArtifacts.filter(artifact => artifact.available);
    }
    return allArtifacts;
  }, [allArtifacts, showOnlyAvailable]);

  const findOriginalIndex = (artifact: ImagePlaceholder) => {
    return allArtifacts.findIndex(a => a.id === artifact.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-full p-4">
        <DialogTitle className="sr-only">Códice Resguardado</DialogTitle>
        <h2 className="text-2xl font-bold text-center mb-2">Códice Resguardado</h2>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Switch 
            id="available-filter" 
            checked={showOnlyAvailable} 
            onCheckedChange={setShowOnlyAvailable} 
          />
          <Label htmlFor="available-filter">Mostrar solo Artefactos Canjeables</Label>
        </div>
        <ScrollArea className="h-[75vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                {filteredArtifacts.map((image) => (
                    <Card 
                      key={image.id} 
                      className="overflow-hidden cursor-pointer group" 
                      onClick={() => onImageClick(showOnlyAvailable ? filteredArtifacts : allArtifacts, findOriginalIndex(image))}
                    >
                        <CardContent className="p-0 relative aspect-square">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className={cn(
                                  "object-cover transition-transform duration-300 group-hover:scale-105",
                                  !image.available && "filter sepia-[.5] grayscale-[.3]"
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
                                  <p className="text-xs text-white/70">No disponible</p>
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
