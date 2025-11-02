
'use client';

import * as React from 'react';
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  const [currentSubIndex, setCurrentSubIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      setCurrentSubIndex(0);
    }
  }, [isOpen, startIndex]);
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isOpen]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentSubIndex(0);
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setCurrentSubIndex(0);
  };
  
  if (!images.length) return null;

  const currentImage = images[currentIndex];
  const imageUrls = currentImage.imageUrls || [];
  const hasMultipleImages = imageUrls.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-none w-full h-full p-0 bg-black/80 backdrop-blur-sm border-0 flex items-center justify-center">
        <DialogTitle className="sr-only">Galería de Imágenes</DialogTitle>
        
        <div className="relative w-full h-full flex items-center justify-center">
            
            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden w-full h-full flex flex-col items-center justify-center p-2 gap-4">
                <div className="relative w-full flex-1">
                    <Image
                        src={imageUrls[currentSubIndex]}
                        alt={currentImage.description}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Button 
                        variant="outline"
                        size="sm" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenArtifact(currentImage);
                        }}
                        className="w-fit bg-black/50 border-green-500/50 text-white hover:bg-green-500/20 hover:text-white hover:border-green-500 z-10"
                    >
                        <Info className="mr-2 h-4 w-4" />
                        Ver Detalles
                    </Button>
                    {hasMultipleImages && (
                        <ScrollArea className="w-full">
                            <div className="flex flex-row gap-2 p-1 justify-center">
                                {imageUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ring-2 ring-transparent transition",
                                            index === currentSubIndex && "ring-primary"
                                        )}
                                        onClick={() => setCurrentSubIndex(index)}
                                    >
                                        <Image
                                            src={url}
                                            alt={`Thumbnail ${index + 1} for ${currentImage.title}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:flex w-full h-full items-center justify-center p-4">
                <div className="flex items-center justify-center h-full">
                    {/* Main Image */}
                    <div className="relative h-full aspect-[4/3] max-w-[calc(100vh*4/3-128px)]">
                        <Image
                            src={imageUrls[currentSubIndex]}
                            alt={currentImage.description}
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                    
                    {/* Desktop: Thumbnails */}
                    {hasMultipleImages && (
                        <div className="flex flex-col w-32 flex-shrink-0 ml-2">
                            <ScrollArea>
                                <div className="flex flex-col gap-2 p-1 max-h-[80vh]">
                                    {imageUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "relative aspect-square w-full flex-shrink-0 cursor-pointer rounded-md overflow-hidden ring-2 ring-transparent transition",
                                                index === currentSubIndex && "ring-primary"
                                            )}
                                            onClick={() => setCurrentSubIndex(index)}
                                        >
                                            <Image
                                                src={url}
                                                alt={`Thumbnail ${index + 1} for ${currentImage.title}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>


            {/* Desktop: Floating details button */}
            <div className='hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2'>
                 <Button 
                    variant="outline"
                    size="sm" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenArtifact(currentImage);
                    }}
                    className="bg-black/50 border-green-500/50 text-white hover:bg-green-500/20 hover:text-white hover:border-green-500 z-10"
                >
                    <Info className="mr-2 h-4 w-4" />
                    Ver Detalles
                </Button>
            </div>

            {/* General Controls (Nav Arrows & Close) */}
            {images.length > 1 && (
                <>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToPrevious}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-20"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goToNext}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-20"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="absolute top-2 right-2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-20"
                aria-label="Close"
            >
                <X className="h-6 w-6" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
