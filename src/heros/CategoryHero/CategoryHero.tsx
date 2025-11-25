import Link from 'next/link'
import { Media } from '@/components/Media'
import React from 'react'

type MediaResource = {
  id: string
  url?: string
  alt?: string
  mimeType?: string
  updatedAt?: string
  createdAt?: string
  [key: string]: unknown
}

export const CategoryHero: React.FC<{
  category: {
    title: string
    slug: string
    heroImage?: MediaResource | string
    description?: string
  }
}> = ({ category }) => {
  const { title, slug: _slug, heroImage, description } = category

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {/* ⭐ BREADCRUMBS ⭐ */}
          <nav className="text-sm mb-5 opacity-90">
            <ul className="flex gap-2 items-center">
              <li>
                <Link href="/" className="hover:underline">
                  Головна
                </Link>
              </li>

              <span>/</span>
              <li>
                <Link href="/categories" className="hover:underline">
                  Категорії
                </Link>
              </li>

              <span>/</span>
              <li className="capitalize text-gray-400">{title}</li>
            </ul>
          </nav>
          {/* END BREADCRUMBS */}

          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>

          {description && <p className="max-w-2xl opacity-90">{description}</p>}
        </div>
      </div>

      <div className="min-h-[60vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media
            fill
            priority
            imgClassName="-z-10 object-cover"
            resource={{
              ...heroImage,
              updatedAt: heroImage.updatedAt ?? '',
              createdAt: heroImage.createdAt ?? '',
            }}
          />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
