'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ClientPagination";

export default function ClientPaginationSection({ currentPage, totalPages, basePath, searchParams }) {
  // Function to build URL with search params
  const buildUrl = (page) => {
    let url = `${basePath}?page=${page}`;
    
    if (searchParams.search) url += `&search=${searchParams.search}`;
    if (searchParams.category) url += `&category=${searchParams.category}`;
    if (searchParams.sort) url += `&sort=${searchParams.sort}`;
    if (searchParams.featured) url += `&featured=${searchParams.featured}`;
    
    return url;
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildUrl(currentPage - 1)} />
          </PaginationItem>
        )}
        
        {Array.from({ length: totalPages }).map((_, i) => {
          // Show current page, first, last, and pages around current
          const pageNumber = i + 1;
          if (
            pageNumber === 1 || 
            pageNumber === totalPages || 
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  href={buildUrl(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }
          
          // Add ellipsis for gaps in pagination
          if ((pageNumber === 2 && currentPage > 3) || 
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)) {
            return <PaginationItem key={`ellipsis-${pageNumber}`}>...</PaginationItem>;
          }
          
          return null;
        })}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}