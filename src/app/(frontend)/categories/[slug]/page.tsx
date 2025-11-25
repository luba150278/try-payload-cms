import React from 'react'
import { getPayload, type PaginatedDocs } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { CategoryHero } from '@/heros/CategoryHero/CategoryHero'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import PageClient from './page.client'

interface Category {
  id: string
  title: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  heroImage?: MediaType | null
  meta?: {
    description?: string
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config })

  // 1️⃣ Знаходимо категорію
  const categoryResult = (await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })) as PaginatedDocs<Category>

  const category = categoryResult.docs[0]
  if (!category) return <p>Категорія не знайдена</p>

  // 2️⃣ Знаходимо пости цієї категорії
  const postsResult = (await payload.find({
    collection: 'posts',
    where: {
      categories: { equals: category.id },
    },
    limit: 1000,
  })) as PaginatedDocs<Post>

  const posts = postsResult.docs
  return (
    <>
      <PageClient />
      <CategoryHero category={category} />

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">{category.title}</h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block rounded overflow-hidden bg-white dark:bg-gray-800 shadow-lg dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:shadow-xl dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-shadow"
              >
                {post.heroImage && (
                  <div className="h-48 w-full relative">
                    <Media fill priority imgClassName="object-cover" resource={post.heroImage} />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {post.title}
                  </h2>
                  {post.meta?.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post.meta.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>У цій категорії поки немає постів.</p>
        )}
      </div>
    </>
  )
}

