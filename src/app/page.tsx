
'use client';

import Image from "next/image";
import Link from "next/link";
import { Store, Mail, Contact } from "lucide-react";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { socialLinks, contactInfo } from "@/lib/pagedata";
import { AlquimaLogo } from "@/components/icons/alquima-logo";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { Copy } from 'lucide-react';

import { GrimoireGallery } from "@/components/grimoire-gallery";
import { MainCarousel } from "@/components/main-carousel";
import { GalleryModal } from "@/components/gallery-modal";
import { ArtifactSheet } from "@/components/artifact-sheet";

export type ModalState = {
  type: 'grimoire' | 'gallery' | 'artifact';
  images?: ImagePlaceholder[];
  startIndex?: number;
  image?: ImagePlaceholder;
};

export default function Home() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const [modalStack, setModalStack] = React.useState<ModalState[]>([]);

  const currentModal = modalStack[modalStack.length - 1];

  const bannerImage = PlaceHolderImages.find(img => img.id === 'banner');
  const allArtifacts = React.useMemo(() => PlaceHolderImages.filter(img => img.category), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const logoUrl = mounted
    ? theme === 'dark'
      ? 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760725595/ALQuiMA_jmd6ih.png'
      : 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760728308/ALQuiMA_ewawxs.png'
    : '';

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${type} copiado`,
        description: `${text} ha sido copiado a tu portapapeles.`,
      });
    });
  };
  
  const openModal = (state: ModalState) => {
    setModalStack(stack => [...stack, state]);
  };
  
  const closeModal = () => {
    setModalStack(stack => stack.slice(0, stack.length - 1));
  };
  
  const handleOpenArtifact = (image: ImagePlaceholder) => {
    openModal({ type: 'artifact', image });
  };
  
  const handleOpenGallery = (images: ImagePlaceholder[], startIndex: number) => {
    openModal({ type: 'gallery', images, startIndex });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="text-4xl font-black text-primary">水</div>
          {mounted && logoUrl ? (
            <Image src={logoUrl} alt="ALQUIMA" width={120} height={40} className="object-contain" priority />
          ) : (
            <div style={{ width: 120, height: 40 }} />
          )}
        </Link>
        <ThemeToggle />
      </header>
      
      <main className="flex-1">
        {bannerImage && (
          <div className="w-full">
            <Image 
              src={bannerImage.imageUrl} 
              alt={bannerImage.description}
              width={1920}
              height={640}
              data-ai-hint={bannerImage.imageHint}
              className="w-full aspect-[3/1] object-cover"
            />
          </div>
        )}

        <div className="container mx-auto max-w-md p-4 text-center">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">@alquima.mizu</h2>
              <p className="text-sm text-muted-foreground">Creatividad hecha colección.</p>
            </div>
          </div>

          <div className="space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3
                    className="text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal({ type: 'grimoire' })}
                  >
                    ▽△▽△▽△ GRIMORIO ▽△▽△▽△
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nexo Códice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <MainCarousel onCategoryClick={(images) => openModal({ type: 'gallery', images, startIndex: 0 })} />

            <h3 className="text-xl font-bold text-primary">▽△▽</h3>
            
            <Button asChild className="h-14 w-full text-base font-semibold shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.03] focus:scale-[1.03]" size="lg" variant="outline">
                <Link href="https://facebook.com/marketplace/profile/100073179595930/" target="_blank" rel="noopener noreferrer">
                    <Store className="mr-2 h-5 w-5"/>
                    Marketplace
                </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="p-8 space-y-8">
        <div className="flex justify-center space-x-6">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground transition-colors duration-200 hover:text-primary"
              aria-label={link.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          ))}
        </div>
        
        <Separator />
        
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-around items-center md:items-start space-y-8 md:space-y-0 text-center">
            <div className="space-y-2">
                 <div className="flex items-center justify-center gap-2">
                    <WhatsappIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">{contactInfo.whatsappNumber}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(contactInfo.whatsappNumber, 'Número')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                 </div>
                 <Button asChild size="sm" variant="link">
                    <Link href={contactInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        Iniciar Chat
                    </Link>
                 </Button>
            </div>
             <div className="space-y-2">
                 <div className="flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{contactInfo.emailAddress}</span>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(contactInfo.emailAddress, 'Correo')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                 </div>
                 <Button asChild size="sm" variant="link">
                    <a href={`mailto:${contactInfo.emailAddress}`}>
                        Enviar Correo
                    </a>
                 </Button>
            </div>
            <div className="space-y-2">
                 <div className="flex items-center justify-center gap-2">
                    <Contact className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Guardar Contacto</span>
                 </div>
                 <Button asChild size="sm" variant="link">
                    <a href="/Alquima_Mizu.vcf" download>
                        Descargar VCF
                    </a>
                 </Button>
            </div>
        </div>
      </footer>

      {/* MODAL CONTROLLER */}
      {currentModal?.type === 'grimoire' && (
        <GrimoireGallery 
          isOpen={true}
          onClose={closeModal}
          allArtifacts={allArtifacts}
          onImageClick={handleOpenGallery}
        />
      )}
      
      {currentModal?.type === 'gallery' && (
        <GalleryModal
          isOpen={true}
          onClose={closeModal}
          images={currentModal.images || []}
          startIndex={currentModal.startIndex || 0}
          onOpenArtifact={handleOpenArtifact}
        />
      )}

      {currentModal?.type === 'artifact' && currentModal.image && (
        <ArtifactSheet
          image={currentModal.image}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
