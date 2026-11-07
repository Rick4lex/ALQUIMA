'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { grimoireCategories } from '@/lib/pagedata';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export function MainCarousel({
  onCategoryClick,
}: {
  onCategoryClick: (images: ImagePlaceholder[]) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [categoryCoverImages, setCategoryCoverImages] = React.useState<Record<string, ImagePlaceholder>>({});

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // Group all available products by category
  const availableProductsByCategory = React.useMemo(() => {
    const map: Record<string, ImagePlaceholder[]> = {};
    grimoireCategories.forEach((category) => {
      map[category.id] = PlaceHolderImages.filter(
        (img) => img.category === category.id && img.available
      );
    });
    return map;
  }, []);

  // Filter only categories that have available products in stock
  const availableCategories = React.useMemo(() => {
    return grimoireCategories.filter(
      (category) => (availableProductsByCategory[category.id] || []).length > 0
    );
  }, [availableProductsByCategory]);

  // Initialize random cover image for each category on mount
  React.useEffect(() => {
    const initialCovers: Record<string, ImagePlaceholder> = {};
    availableCategories.forEach((category) => {
      const prods = availableProductsByCategory[category.id] || [];
      if (prods.length > 0) {
        const randomIndex = Math.floor(Math.random() * prods.length);
        initialCovers[category.id] = prods[randomIndex];
      }
    });
    setCategoryCoverImages(initialCovers);
  }, [availableCategories, availableProductsByCategory]);

  // Option B: Rotate category cover image to another random available product
  // every time a slide changes or cycles in Embla Carousel
  React.useEffect(() => {
    if (!api || availableCategories.length === 0) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      const nextIndex = (selectedIndex + 1) % availableCategories.length;
      const targetCategories = [
        availableCategories[selectedIndex],
        availableCategories[nextIndex],
      ].filter(Boolean);

      setCategoryCoverImages((prev) => {
        let changed = false;
        const updated = { ...prev };

        targetCategories.forEach((category) => {
          const prods = availableProductsByCategory[category.id] || [];
          if (prods.length > 1) {
            const currentCover = prev[category.id];
            // Filter out the current image to avoid immediate duplicate
            const pool = currentCover
              ? prods.filter((p) => p.id !== currentCover.id)
              : prods;
            const candidates = pool.length > 0 ? pool : prods;
            const randomProduct = candidates[Math.floor(Math.random() * candidates.length)];

            if (randomProduct && (!currentCover || currentCover.id !== randomProduct.id)) {
              updated[category.id] = randomProduct;
              changed = true;
            }
          }
        });

        return changed ? updated : prev;
      });
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, availableCategories, availableProductsByCategory]);

  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{
        loop: availableCategories.length > 1,
      }}
      plugins={[autoplayPlugin.current]}
    >
      <CarouselContent>
        {availableCategories.map((category) => {
          const cardImage = categoryCoverImages[category.id];
          const categoryImages = availableProductsByCategory[category.id] || [];
          if (!cardImage) return null;

          // When clicked, open the category gallery placing the visible cover product first
          const handleCardClick = () => {
            const reorderedImages = cardImage
              ? [cardImage, ...categoryImages.filter((img) => img.id !== cardImage.id)]
              : categoryImages;
            onCategoryClick(reorderedImages);
          };

          return (
            <CarouselItem key={category.id}>
              <Card
                className="overflow-hidden rounded-xl shadow-lg border-2 border-primary/25 hover:border-primary/60 transition-all duration-300 cursor-pointer group bg-card select-none"
                onClick={handleCardClick}
              >
                <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden">
                  {/* Dynamic Product Image with smooth transition and hover zoom (No floating badges) */}
                  <Image
                    key={cardImage.id}
                    src={cardImage.imageUrls[0]}
                    alt={cardImage.title || cardImage.description || category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                    data-ai-hint={
                      Array.isArray(cardImage.imageHint)
                        ? cardImage.imageHint.join(' ')
                        : cardImage.imageHint
                    }
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Aesthetic Mystic Vignette Gradient (No floating badges) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Category Title */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between pointer-events-none z-10">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md font-body">
                      {category.title}
                    </h4>
                    <span className="text-xs text-white/80 font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                      Explorar colección →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {availableCategories.length > 1 && (
        <>
          <CarouselPrevious
            className={cn(
              'absolute left-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 text-foreground hover:bg-background/90 hover:scale-105 border border-border/50 shadow-md transition-all z-20'
            )}
          />
          <CarouselNext
            className={cn(
              'absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 text-foreground hover:bg-background/90 hover:scale-105 border border-border/50 shadow-md transition-all z-20'
            )}
          />
        </>
      )}
    </Carousel>
  );
}
