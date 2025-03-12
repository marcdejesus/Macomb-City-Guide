'use client';

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ children }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center"
    >
      {children}
    </nav>
  );
}

export function PaginationContent({ children }) {
  return (
    <ul className="flex flex-row items-center gap-1">
      {children}
    </ul>
  );
}

export function PaginationItem({ children }) {
  return (
    <li className="flex items-center">
      {children}
    </li>
  );
}

export function PaginationLink({ 
  href, 
  isActive, 
  children 
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size: "icon",
        }),
        "h-9 w-9"
      )}
    >
      {children}
    </Link>
  );
}

export function PaginationPrevious({ href }) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "icon",
        }),
        "gap-1 pl-2.5"
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </Link>
  );
}

export function PaginationNext({ href }) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "icon",
        }),
        "gap-1 pr-2.5"
      )}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}