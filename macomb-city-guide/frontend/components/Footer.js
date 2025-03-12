import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Landmark, 
  Calendar, 
  Utensils, 
  Building, 
  Bus, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const mainNavItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/attractions", label: "Attractions", icon: <Landmark className="h-4 w-4" /> },
    { href: "/events", label: "Events", icon: <Calendar className="h-4 w-4" /> },
    { href: "/dining", label: "Dining", icon: <Utensils className="h-4 w-4" /> },
    { href: "/real-estate", label: "Real Estate", icon: <Building className="h-4 w-4" /> },
    { href: "/transportation", label: "Transportation", icon: <Bus className="h-4 w-4" /> },
  ];
  
  const resourceLinks = [
    { href: "/about", label: "About Macomb" },
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and City Description */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="font-bold text-2xl">Macomb City Guide</div>
            </Link>
            <p className="mt-2 text-muted-foreground">
              Your comprehensive guide to everything Macomb has to offer - from local 
              attractions and events to dining, real estate, and transportation options.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-base font-medium mb-2">Explore Macomb</h3>
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground flex items-center"
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base font-medium mb-2">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-medium mb-2">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Main St, Macomb, MI 48044</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@macombguide.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mt-4 sm:mt-0">
            © {currentYear} Macomb City Guide. All rights reserved. Created by Marc De Jesus.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-muted-foreground hover:text-foreground">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}