'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = ({ className, page, totalPages }) => {
  const router = useRouter()

  const goToPage = (p: number) => {
    if (p <= 1) {
      router.push('/posts') // ← головна сторінка пагінації
    } else {
      router.push(`/posts/page/${p}`)
    }
  }

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          {/* PREVIOUS */}
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} onClick={() => goToPage(page - 1)} />
          </PaginationItem>

          {/* ... */}
          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* PREVIOUS PAGE */}
          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          {/* CURRENT PAGE */}
          <PaginationItem>
            <PaginationLink isActive onClick={() => goToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {/* NEXT PAGE */}
          {hasNextPage && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* NEXT */}
          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
