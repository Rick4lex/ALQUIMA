import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";
import { AlquimaLogo } from "@/components/icons/alquima-logo";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const links = [
  { name: "Minifiguras", href: "#" },
  { name: "Dibujos", href: "#" },
  { name: "Stickers", href: "#" },
  { name: "Tatuajes", href: "#" },
  { name: "Accesorios", href: "#" },
];

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

export default function Home() {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar');

  return (
    <div className="flex min-h-dvh flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <AlquimaLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-wider">ALQUIMA 水</h1>
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
              <h2 className="text-2xl font-bold font-headline">@alquima_mizu</h2>
              <p className="text-sm text-muted-foreground">Art & Collectibles inspired by mysticism.</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Button
                key={link.name}
                asChild
                className="h-14 w-full text-base font-semibold shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.03] focus:scale-[1.03]"
                variant="default"
                size="lg"
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
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
