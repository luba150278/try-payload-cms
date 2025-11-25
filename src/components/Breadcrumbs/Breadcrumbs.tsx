'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
  const pathname = usePathname()

  if (!pathname || pathname === '/') return null

  const parts = pathname.split('/').filter(Boolean)

  return (
    <section className="container mx-auto py-2">
      <nav className="mb-5 text-sm text-gray-600">
        <ul className="flex items-center gap-1">
          {/* Головна */}
          <li>
            <Link href="/" className="hover:underline">
              Головна
            </Link>
          </li>

          <span>/</span>

          {parts.map((part, index) => {
            const href = '/' + parts.slice(0, index + 1).join('/')
            const isLast = index === parts.length - 1

            const label = decodeURIComponent(part).replace(/-/g, ' ')

            return (
              <li key={href} className="flex items-center gap-2">
                {isLast ? (
                  // 🔹 Останній елемент — просто текст, НЕ лінк
                  <span className="font-medium capitalize text-gray-800">{label}</span>
                ) : (
                  // 🔹 Попередні елементи — лінки
                  <Link href={href} className="hover:underline capitalize">
                    {label}
                  </Link>
                )}

                {!isLast && <span>/</span>}
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}
