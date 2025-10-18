
'use client';

import Image from "next/image";
import Link from "next/link";
import { Copy, Store } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
import { socialLinks, contactInfo, grimoireCards } from "@/lib/pagedata";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const bannerImage = PlaceHolderImages.find(img => img.id === 'banner');

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    setMounted(true);
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

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="text-4xl font-black text-primary">水</div>
          {mounted ? (
            <Image src={AlquimaLogo} alt="ALQUIMA" width={120} height={30} className="object-contain" priority />
          ) : (
            <div style={{ width: 120, height: 30 }} />
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
            
            <Carousel
              className="w-full"
              opts={{
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
            >
              <CarouselContent>
                {grimoireCards.map((card) => {
                  const cardImage = PlaceHolderImages.find(img => img.id === card.imageId);
                  if (!cardImage) return null;

                  return (
                    <CarouselItem key={card.id}>
                       <Dialog>
                        <DialogTrigger asChild>
                          <Card className="overflow-hidden rounded-lg shadow-lg border-2 border-primary/20 cursor-pointer">
                            <CardContent className="relative flex aspect-video items-center justify-center p-0">
                              <Image
                                src={cardImage.imageUrl}
                                alt={cardImage.description}
                                fill
                                data-ai-hint={cardImage.imageHint}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <h4 className="absolute bottom-4 text-2xl font-bold text-white z-10">{card.title}</h4>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0">
                           <ScrollArea className="max-h-[80vh]">
                            <Image
                                src={cardImage.imageUrl}
                                alt={cardImage.description}
                                width={1920}
                                height={1080}
                                className="w-full h-auto object-contain rounded-lg"
                              />
                           </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <h3 className="text-xl font-bold text-primary">▽△▽</h3>
            
            <Button asChild className="h-14 w-full text-base font-semibold shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.03] focus:scale-[1.03]" size="lg" variant="outline">
                <Link href="https://web.facebook.com/marketplace/profile/100073179595930/" target="_blank" rel="noopener noreferrer">
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
        
        <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row justify-around items-center md:items-start space-y-8 md:space-y-0 text-center">
            <div className="space-y-2">
                 <div className="flex items-center justify-center gap-2">
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
        </div>
      </footer>
    </div>
  );
}
