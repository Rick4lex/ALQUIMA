
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

export function ArtifactSheet({ image, onClose }: { image: ImagePlaceholder; onClose: () => void }) {
  const whatsappInquiryUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, estoy interesado en el artefacto: ${image.title}`)}`;
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
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover filter brightness-50"
        />
        <div className="relative z-10 p-6 flex flex-col h-[80vh] max-h-[600px] justify-between text-white">
          <div className="text-right">
            {categoryName && <p className="text-xs font-bold tracking-widest text-white/80 mb-4">{categoryName}</p>}
          </div>
          <div>
            <h3 className="text-3xl font-bold">{image.title}</h3>
            <Separator className="my-4 bg-white/50" />
            <p className="text-sm leading-relaxed">{image.details}</p>
          </div>
          <div className="space-y-4">
            {image.price && (
                <div className="text-center mb-2">
                    <p className="text-lg font-bold">{image.price}</p>
                </div>
            )}
            <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-base">
              <Link href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="mr-2 h-5 w-5"/>
                Consultar Artefacto
              </Link>
            </Button>
            <div className="flex justify-between items-center">
                <Button onClick={onClose} variant="ghost" className="z-20 text-white/80 hover:text-white px-2">
                    Ver menos
                </Button>
                <AlquimaLogo className="h-8 w-auto text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
