'use client'
import React from 'react'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

const MenuItem: React.FC<{ item: NonNullable<HeaderType['navItems']>[number] }> = ({ item }) => {
  return (
    <li className="relative group">
      <CMSLink {...item.link} appearance="link" />
      {item.children && item.children.length > 0 && (
        <ul
          className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-gray-900 shadow-md dark:shadow-white/20 px-4 py-2"
        >
          {item.children.map((child: NonNullable<HeaderType['navItems']>[number], i: number) => (
            <MenuItem key={i} item={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-3">
      <ul className="flex gap-3">
        {navItems.map((item: NonNullable<HeaderType['navItems']>[number], i: number) => (
          <MenuItem key={i} item={item} />
        ))}
      </ul>

      <Link href="/search">
        <span className="sr-only">Пошук</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
