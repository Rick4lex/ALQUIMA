
'use client';

import * as React from 'react';
import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-full p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Grimorio Completo</h2>
        <ScrollArea className="h-[80vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                {allArtifacts.map((image, index) => (
                    <Card key={image.id} className="overflow-hidden cursor-pointer" onClick={() => onImageClick(allArtifacts, index)}>
                        <CardContent className="p-0 relative aspect-square">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute bottom-0 left-0 p-2 text-white">
                                <h4 className="font-bold text-sm">{image.title}</h4>
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
