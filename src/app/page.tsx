
'use client';

import Image from "next/image";
import Link from "next/link";
import { Copy, Store, Mail, Contact, ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { socialLinks, contactInfo, grimoireCategories } from "@/lib/pagedata";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlquimaLogo } from "@/components/icons/alquima-logo";

function ArtifactSheet({ image, onClose }: { image: ImagePlaceholder, onClose: () => void }) {
  const whatsappInquiryUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, estoy interesado en el artefacto: ${image.title}`)}`;
  const categoryName = grimoireCategories.find(cat => cat.id === image.category)?.title.toUpperCase();

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover filter brightness-50"
        />
        <div className="relative z-10 p-6 flex flex-col h-[70vh] max-h-[500px] justify-between bg-black/30 backdrop-blur-sm text-white">
          <div>
            <p className="text-right text-xs font-bold tracking-widest text-white/80 mb-4">CATEGORÍA: {categoryName}</p>
            <h3 className="text-2xl font-bold">{image.title}</h3>
            <Separator className="my-3 bg-white/50" />
            <p className="text-sm">{image.details}</p>
          </div>
          <div className="space-y-4">
            <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
              <Link href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="mr-2 h-5 w-5"/>
                Consultar Artefacto
              </Link>
            </Button>
            <AlquimaLogo className="h-8 w-auto mx-auto text-white/70" />
          </div>
        </div>
         <Button onClick={onClose} variant="ghost" className="absolute bottom-4 right-4 z-20 text-white/80 hover:text-white">
            Ver menos
          </Button>
      </div>
    </div>
  );
}


function GalleryModal({ images, startIndex, onClose, onOpenArtifact }: { images: ImagePlaceholder[], startIndex: number, onClose: () => void, onOpenArtifact: (image: ImagePlaceholder) => void }) {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
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
              onClick={() => onOpenArtifact(currentImage)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/50 hover:bg-background/75 z-10"
          >
              <Info className="mr-2 h-4 w-4" />
              Ver Detalles
          </Button>
      </div>
    </DialogContent>
  );
}


export default function Home() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const bannerImage = PlaceHolderImages.find(img => img.id === 'banner');
  const [galleryState, setGalleryState] = React.useState<{ images: ImagePlaceholder[], startIndex: number, isOpen: boolean }>({ images: [], startIndex: 0, isOpen: false });
  const [artifactSheetState, setArtifactSheetState] = React.useState<{ image: ImagePlaceholder | null, isOpen: boolean }>({ image: null, isOpen: false });
  const [categoryCoverImages, setCategoryCoverImages] = React.useState<Record<string, ImagePlaceholder>>({});


  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    setMounted(true);
    
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

  const AlquimaLogo = theme === 'dark' 
    ? 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760725595/ALQuiMA_jmd6ih.png'
    : 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760728308/ALQuiMA_ewawxs.png';

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${type} copiado`,
        description: `${text} ha sido copiado a tu portapapeles.`,
      });
    });
  };

  const openGallery = (category: string, startIndex: number = 0) => {
    const images = PlaceHolderImages.filter(img => img.category === category);
    setGalleryState({ images, startIndex, isOpen: true });
  };
  
  const closeGallery = () => setGalleryState(s => ({ ...s, isOpen: false }));

  const openArtifactSheet = (image: ImagePlaceholder) => {
    setArtifactSheetState({ image, isOpen: true });
    closeGallery();
  };

  const closeArtifactSheet = () => setArtifactSheetState({ image: null, isOpen: false });


  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="text-4xl font-black text-primary">水</div>
          {mounted ? (
            <Image src={AlquimaLogo} alt="ALQUIMA" width={120} height={40} className="object-contain" priority />
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
            <h3 className="text-xl font-bold text-primary">▽△▽△▽△ GRIMORIO ▽△▽△▽△</h3>
            
            <Dialog open={galleryState.isOpen} onOpenChange={(isOpen) => !isOpen && closeGallery()}>
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
                    if (!cardImage) return null;

                    return (
                      <CarouselItem key={category.id}>
                         <DialogTrigger asChild>
                           <Card 
                              className="overflow-hidden rounded-lg shadow-lg border-2 border-primary/20 cursor-pointer"
                              onClick={() => openGallery(category.id)}
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
                         </DialogTrigger>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className={cn("absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
                <CarouselNext className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background/75 z-10")} />
              </Carousel>
              {galleryState.isOpen && <GalleryModal images={galleryState.images} startIndex={galleryState.startIndex} onClose={closeGallery} onOpenArtifact={openArtifactSheet} />}
            </Dialog>

            {artifactSheetState.isOpen && artifactSheetState.image && (
              <ArtifactSheet image={artifactSheetState.image} onClose={closeArtifactSheet} />
            )}

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
    </div>
  );
}
