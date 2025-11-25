// import React from 'react'
// import Link from 'next/link'
// import { getPayload, type PaginatedDocs } from 'payload'
// import config from '@payload-config'
// import { Media } from '@/components/Media' // якщо використовуєш компонент для зображень

// interface CategoriesBlockProps {
//   heading?: string
// }

// interface Category {
//   id: string
//   title: string
//   slug: string
//   heroImage?: string
//   posts?: string[] // для підрахунку кількості постів
// }

// export const CategoriesBlock = async ({ heading }: CategoriesBlockProps) => {
//   const payload = await getPayload({ config })

//   // Отримуємо категорії
//   const categoriesData = (await payload.find({
//     collection: 'categories',
//     limit: 50,
//   })) as PaginatedDocs<Category>

//   const categories = categoriesData.docs

//   // Можна додатково отримати кількість постів для кожної категорії
//   // Через агрегат або фільтр на posts collection, але для простоти - поки припустимо, що є поле `postsCount` або масив `posts`

//   return (
//     <section className="container mx-auto py-10">
//       {heading && <h2 className="text-2xl font-bold mb-6">{heading}</h2>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {categories.map((category) => (
//           <Link
//             key={category.id}
//             href={`/categories/${category.slug}`}
//             className="block border rounded overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             {category.heroImage && (
//               <div className="h-48 w-full relative">
//                 <Media fill priority imgClassName="object-cover" resource={category.heroImage} />
//               </div>
//             )}
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
//               <p className="text-sm text-gray-500">{category.posts?.length ?? 0} рецептів</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }
import React from 'react'
import Link from 'next/link'
import { getPayload, type PaginatedDocs } from 'payload'
import config from '@payload-config'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface CategoriesBlockProps {
  heading?: string
}

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

export const CategoriesBlock = async ({ heading }: CategoriesBlockProps) => {
  const payload = await getPayload({ config })

  // 1️⃣ Отримуємо категорії
  const categoriesData = (await payload.find({
    collection: 'categories',
    limit: 8,
  })) as PaginatedDocs<Category>
  const categories = categoriesData.docs

  // 2️⃣ Отримуємо пости (обмежуємо поля для економії)
  const postsData = (await payload.find({
    collection: 'posts',
    limit: 1000,
    // fields: ['categories'],
  })) as PaginatedDocs<Post>

  const posts = postsData.docs

  // 3️⃣ Map: categoryId -> кількість постів
 const postsCountMap: Record<string, number> = {}

 posts.forEach((post) => {
   post.categories.forEach((cat) => {
     const catId = typeof cat === 'string' ? cat : cat.id
     postsCountMap[catId] = (postsCountMap[catId] || 0) + 1
   })
 })
  
  

  return (
    <div className="container mx-auto pb-10">
      {heading && <h2 className="text-2xl font-bold mb-6">{heading}</h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="rounded overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:shadow-lg dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-shadow"
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
    </div>
  )
}

