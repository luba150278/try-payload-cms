import React from 'react'
import { getPayload, type PaginatedDocs } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Category {
  id: string
  title: string
  slug: string
  heroImage?: MediaType | null
}

interface Post {
  id: string
  categories: { id: string; title?: string; slug?: string }[]
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config })

  // 1️⃣ Отримуємо всі категорії
  const categoriesData = (await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })) as PaginatedDocs<Category>
  const categories = categoriesData.docs

  // 2️⃣ Отримуємо всі пости для підрахунку
  const postsData = (await payload.find({
    collection: 'posts',
    limit: 1000,
    // можна обмежити поля для економії: fields: ['categories']
  })) as PaginatedDocs<Post>
  const posts = postsData.docs

  // 3️⃣ Map: categoryId -> кількість постів
  const postsCountMap: Record<string, number> = {}
  posts.forEach((post) => {
    post.categories.forEach((cat) => {
      const catId = cat.id
      postsCountMap[catId] = (postsCountMap[catId] || 0) + 1
    })
  })

  return (
    <div className="container mx-auto py-10">
      <nav className="text-sm mb-5 opacity-90">
        <ul className="flex gap-2 items-center">
          <li>
            <Link href="/" className="hover:underline">
              Головна
            </Link>
          </li>
          <span>/</span>
          <li className="capitalize text-gray-400">Категорії рецептів</li>
        </ul>
      </nav>
      <h1 className="text-3xl font-bold mb-6">Категорії рецептів</h1>

      {categories.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="block rounded overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:shadow-lg dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-shadow"
            >
              {category.heroImage && (
                <div className="h-48 w-full relative">
                  <Media fill priority imgClassName="object-cover" resource={category.heroImage} />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                <p className="text-sm text-gray-500">{postsCountMap[category.id] ?? 0} рецептів</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Категорій не знайдено.</p>
      )}
    </div>
  )
}
