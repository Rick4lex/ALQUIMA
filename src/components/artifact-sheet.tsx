
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
import { ScrollArea } from '@/components/ui/scroll-area';


export function ArtifactSheet({ image, onClose }: { image: ImagePlaceholder; onClose: () => void }) {
  const whatsappInquiryUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, estoy interesado en: ${image.title}`)}`;
  const whatsappHuntUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, estoy interesado en adquirir: ${image.title}. ¿Es posible encontrarlo nuevamente?`)}`;
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

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-in fade-in-0"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.imageUrls[0]}
          alt={image.description}
          fill
          className={cn("object-cover", !image.available && "tint-green")}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <div className="relative h-[80vh] max-h-[600px] flex flex-col text-white">
            <ScrollArea className="flex-1">
                <div className="p-6 flex flex-col justify-center text-center h-full">
                    {categoryName && <p className="text-xs font-bold tracking-widest text-white/50 mb-4">{categoryName}</p>}
                    
                    <h3 className="text-3xl font-bold">{image.title}</h3>
                    <Separator className="my-4 bg-white/20" />
                    
                    {!image.available && (
                        <Badge variant="secondary" className="mb-4 mx-auto w-fit">
                            Este artefacto ya encontró a su portador.
                        </Badge>
                    )}

                    <p className="text-sm leading-relaxed mb-4 text-white/80">
                    {image.details}
                    </p>
                </div>
            </ScrollArea>
            
            <div className="p-6 space-y-4">
                {image.available && image.price && (
                    <div className="text-center mb-2">
                        <p className="text-lg font-bold">{image.price}</p>
                    </div>
                )}
                
                {image.available ? (
                <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-base">
                    <Link href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="mr-2 h-5 w-5"/>
                    Consultar
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
                    <Button onClick={onClose} variant="ghost" className="z-20 text-white/70 hover:text-white px-2">
                        Cerrar
                    </Button>
                    <AlquimaLogo className="h-8 w-auto text-white/70" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
