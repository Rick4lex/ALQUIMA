
'use client';

import * as React from 'react';
import Image from "next/image";
import Link from "next/link";
import { contactInfo, grimoireCategories } from "@/lib/pagedata";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { AlquimaLogo } from "@/components/icons/alquima-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function ArtifactSheet({ image, onClose }: { image: ImagePlaceholder; onClose: () => void }) {
  const whatsappInquiryUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, estoy interesado en: ${image.title}`)}`;
  const whatsappHuntUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola Alquima Mizu, estoy interesado en iniciar una caza para el artefacto: ${image.title}. ¿Es posible encontrarlo nuevamente?`)}`;
  const categoryName = grimoireCategories.find(cat => cat.id === image.category)?.title.toUpperCase();

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const hasMultipleImages = image.imageUrls && image.imageUrls.length > 1;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-8"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative aspect-square'>
          {hasMultipleImages ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {image.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-full aspect-square">
                      <Image
                        src={url}
                        alt={`${image.description} - view ${index + 1}`}
                        fill
                        className={cn("object-cover", !image.available && "tint-green")}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {hasMultipleImages && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          ) : (
            <Image
              src={image.imageUrls[0]}
              alt={image.description}
              fill
              className={cn("object-cover", !image.available && "tint-green")}
            />
          )}
        </div>
        
        <div className="p-6 flex flex-col justify-between text-card-foreground">
          <div className="text-right">
            {categoryName && <p className="text-xs font-bold tracking-widest text-muted-foreground mb-4">{categoryName}</p>}
          </div>
          <div>
            <h3 className="text-3xl font-bold">{image.title}</h3>
            <Separator className="my-4" />
            
            {!image.available && (
                <Badge variant="secondary" className="mb-4">
                    Este artefacto ya encontró a su portador.
                </Badge>
            )}

            <p className="text-sm leading-relaxed mb-4">
              {image.details}
            </p>
          </div>
          <div className="space-y-4">
            {image.available && image.price && (
                <div className="text-center mb-2">
                    <p className="text-lg font-bold">{image.price}</p>
                </div>
            )}
            
            {image.available ? (
              <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-base">
                <Link href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="mr-2 h-5 w-5"/>
                  Consultar Artefacto
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold h-12 text-base">
                <Link href={whatsappHuntUrl} target="_blank" rel="noopener noreferrer">
                  Solicitar Caza
                </Link>
              </Button>
            )}

            <div className="flex justify-between items-center mt-4">
                <Button onClick={onClose} variant="ghost" className="z-20 text-muted-foreground hover:text-foreground px-2">
                    Cerrar
                </Button>
                <AlquimaLogo className="h-8 w-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
