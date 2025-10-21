
'use client';

import * as React from 'react';
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GalleryModal({ 
  isOpen, 
  onClose, 
  images, 
  startIndex, 
  onOpenArtifact 
}: { 
  isOpen: boolean;
  onClose: () => void;
  images: ImagePlaceholder[];
  startIndex: number;
  onOpenArtifact: (image: ImagePlaceholder) => void;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
    }
  }, [isOpen, startIndex]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0">
        <div className="relative">
          <ScrollArea className="max-h-[90vh] rounded-lg">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.description}
              width={1920}
              height={1080}
              className="w-full h-auto object-contain rounded-lg"
            />
          </ScrollArea>

          <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-20" onClick={onClose}>
                  <X className="h-6 w-6" />
              </Button>
          </DialogClose>
          
          {images.length > 1 && (
              <>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10"
                  >
                      <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10"
                  >
                      <ChevronRight className="h-6 w-6" />
                  </Button>
              </>
          )}
          <Button 
                variant="outline"
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenArtifact(currentImage);
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/50 hover:bg-background/75 z-10"
            >
                <Info className="mr-2 h-4 w-4" />
                Ver Detalles
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
