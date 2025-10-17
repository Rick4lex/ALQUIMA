
'use client';

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Store } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: <Instagram className="h-6 w-6" />,
  },
  {
    name: "Facebook",
    href: "#",
    icon: <Facebook className="h-6 w-6" />,
  },
  {
    name: "WhatsApp",
    href: "#",
    icon: <WhatsappIcon className="h-6 w-6" />,
  },
  {
    name: "Email",
    href: "mailto:hello@alquima.art",
    icon: <Mail className="h-6 w-6" />,
  },
];

const grimoireCards = [
    { id: "grimoire-1", title: "Minifiguras", imageId: "minifiguras" },
    { id: "grimoire-2", title: "Dibujos", imageId: "dibujos" },
    { id: "grimoire-3", title: "Stickers", imageId: "stickers" },
    { id: "grimoire-4", title: "Tatuajes", imageId: "tatuajes" },
    { id: "grimoire-5", title: "Accesorios", imageId: "accesorios" },
];


export default function Home() {
  const { theme } = useTheme();
  const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar');

  const AlquimaLogo = theme === 'dark' 
    ? 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760725595/ALQuiMA_jmd6ih.png'
    : 'https://res.cloudinary.com/dyeppbrfl/image/upload/v1760728308/ALQuiMA_ewawxs.png';

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="text-4xl font-black text-primary">水</div>
          <Image src={AlquimaLogo} alt="ALQUIMA" width={120} height={30} className="object-contain" priority />
        </Link>
        <ThemeToggle />
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
              {avatarImage && (
                 <AvatarImage src={avatarImage.imageUrl} alt={avatarImage.description} />
              )}
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">@alquima.mizu</h2>
              <p className="text-sm text-muted-foreground">Creatividad hecha colección.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">△▽△ GRIMORIO ▽△▽</h3>
            
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {grimoireCards.map((card) => {
                  const cardImage = PlaceHolderImages.find(img => img.id === card.imageId);
                  return (
                    <CarouselItem key={card.id}>
                      <Card className="overflow-hidden rounded-lg shadow-lg border-2 border-primary/20">
                        <CardContent className="relative flex aspect-video items-center justify-center p-0">
                          {cardImage ? (
                            <Image
                              src={cardImage.imageUrl}
                              alt={cardImage.description}
                              fill
                              data-ai-hint={cardImage.imageHint}
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                             <div className="w-full h-full bg-secondary"></div>
                          )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                           <h4 className="absolute bottom-4 text-2xl font-bold text-white z-10">{card.title}</h4>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex"/>
            </Carousel>
            
            <Button asChild className="h-14 w-full text-base font-semibold shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.03] focus:scale-[1.03]" size="lg" variant="outline">
                <Link href="https://web.facebook.com/marketplace/profile/100073179595930/" target="_blank" rel="noopener noreferrer">
                    <Store className="mr-2 h-5 w-5"/>
                    Marketplace
                </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="p-8">
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
      </footer>
    </div>
  );
}

    
