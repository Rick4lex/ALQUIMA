
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

export function MainCarousel({ onCategoryClick }: { onCategoryClick: (images: ImagePlaceholder[]) => void }) {
  const [categoryCoverImages, setCategoryCoverImages] = React.useState<Record<string, ImagePlaceholder>>({});
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    const covers: Record<string, ImagePlaceholder> = {};
    grimoireCategories.forEach(category => {
      const categoryImages = PlaceHolderImages.filter(img => img.category === category.id);
      if (categoryImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryImages.length);
        covers[category.id] = categoryImages[randomIndex];
      }
    });
    setCategoryCoverImages(covers);
  }, []);

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
      plugins={[autoplayPlugin.current]}
    >
      <CarouselContent>
        {grimoireCategories.map((category) => {
          const cardImage = categoryCoverImages[category.id];
          const categoryImages = PlaceHolderImages.filter(img => img.category === category.id);
          if (!cardImage) return null;

          return (
            <CarouselItem key={category.id}>
                <Card 
                  className="overflow-hidden rounded-lg shadow-lg border-2 border-primary/20 cursor-pointer"
                  onClick={() => onCategoryClick(categoryImages)}
                >
                  <CardContent className="relative flex aspect-video items-center justify-center p-0">
                    <Image
                      src={cardImage.imageUrl}
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
      <CarouselPrevious className={cn("absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
      <CarouselNext className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
    </Carousel>
  );
}
