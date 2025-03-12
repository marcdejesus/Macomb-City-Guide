"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  Home, 
  Landmark, 
  Calendar, 
  Utensils, 
  Building, 
  Bus, 
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const mainNavItems = [
    { href: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    { href: "/attractions", label: "Attractions", icon: <Landmark className="mr-2 h-4 w-4" /> },
    { href: "/events", label: "Events", icon: <Calendar className="mr-2 h-4 w-4" /> },
    { href: "/dining", label: "Dining", icon: <Utensils className="mr-2 h-4 w-4" /> },
    { href: "/real-estate", label: "Real Estate", icon: <Building className="mr-2 h-4 w-4" /> },
    { href: "/transportation", label: "Transportation", icon: <Bus className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">Macomb Guide</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavItems.slice(1).map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === item.href && "bg-accent text-accent-foreground",
                        "flex items-center"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Account
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link href="/login" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Login</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Sign in to your account
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/register" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Register</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Create a new account
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Profile</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View your saved items
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center px-2">
                <span className="font-bold text-xl">Macomb Guide</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-2 py-1 rounded-md hover:bg-accent",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ))}
                <hr className="my-2" />
                <Link
                  href="/login"
                  className="flex items-center px-2 py-1 rounded-md hover:bg-accent"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Login / Register</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center px-2 py-1 rounded-md hover:bg-accent"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-auto flex items-center md:hidden">
          <span className="font-bold text-lg">Macomb</span>
        </Link>

        {/* Search */}
        <div className="flex items-center justify-between space-x-2">
          <div className="relative">
            {isSearchOpen ? (
              <div className="absolute right-0 top-0 flex items-center">
                <Input
                  placeholder="Search..."
                  className="w-[250px] md:w-[300px]"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* User Menu - Desktop Only */}
          <Link href="/login" className="hidden md:block">
            <Button variant="outline" size="sm">
              <UserCircle className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}