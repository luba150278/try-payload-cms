import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import PAGINATION_LIMIT from '@/utilities/paginationLimit'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: PAGINATION_LIMIT,

    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-4 pb-24">
      <PageClient />
      <nav className="container text-sm mb-5 opacity-90">
        <ul className="flex gap-2 items-center">
          <li>
            <Link href="/" className="hover:underline">
              Головна
            </Link>
          </li>

          <span>/</span>
          <li className="capitalize text-gray-400">Рецепти</li>
        </ul>
      </nav>
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Рецепти</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={PAGINATION_LIMIT}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
