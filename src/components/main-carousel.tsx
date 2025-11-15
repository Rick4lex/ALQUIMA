
'use client';

import * as React from 'react';
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { grimoireCategories } from "@/lib/pagedata";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

function CategoryCarousel({ 
  onImageClick,
  isModalOpen
}: { 
  onImageClick: (images: ImagePlaceholder[], startIndex: number) => void;
  isModalOpen: boolean;
}) {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!autoplayPlugin.current) return;
    if (isModalOpen) {
      autoplayPlugin.current.stop();
    }
  }, [isModalOpen]);


  const categoryImages = React.useMemo(() => {
    const grouped: Record<string, ImagePlaceholder[]> = {};
    const allImages = PlaceHolderImages.filter(img => img.category);

    grimoireCategories.forEach(category => {
      const imagesForCategory = allImages.filter(img => img.category === category.id);
      if (imagesForCategory.length > 0) {
        grouped[category.id] = imagesForCategory;
      }
    });
    return grouped;
  }, []);

  const availableCategories = grimoireCategories.filter(cat => categoryImages[cat.id]);

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: availableCategories.length > 1,
      }}
      plugins={[autoplayPlugin.current]}
    >
      <CarouselContent>
        {availableCategories.map((category) => {
          const images = categoryImages[category.id];
          const cardImage = images[0];

          return (
            <CarouselItem key={category.id}>
                <Card 
                  className="overflow-hidden rounded-lg shadow-lg border-2 border-primary/20 cursor-pointer group"
                  onClick={() => onImageClick(images, 0)}
                >
                  <CardContent className="relative flex aspect-video items-center justify-center p-0">
                    <Image
                      src={cardImage.imageUrls[0]}
                      alt={cardImage.description}
                      fill
                      data-ai-hint={cardImage.imageHint}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h4 className="absolute bottom-4 text-2xl font-bold text-white z-10">{category.title}</h4>
                  </CardContent>
                </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {availableCategories.length > 1 && (
        <>
          <CarouselPrevious className={cn("absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
          <CarouselNext className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
        </>
      )}
    </Carousel>
  );
}


export function MainCarousel({ 
  onImageClick,
  isModalOpen 
}: { 
  onImageClick: (images: ImagePlaceholder[], startIndex: number) => void;
  isModalOpen: boolean;
}) {
  return (
    <CategoryCarousel onImageClick={onImageClick} isModalOpen={isModalOpen} />
  );
}
