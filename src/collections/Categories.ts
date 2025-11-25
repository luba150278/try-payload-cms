// import type { CollectionConfig } from 'payload'

// import { anyone } from '../access/anyone'
// import { authenticated } from '../access/authenticated'
// import { slugField } from 'payload'

// export const Categories: CollectionConfig = {
//   slug: 'categories',
//   access: {
//     create: authenticated,
//     delete: authenticated,
//     read: anyone,
//     update: authenticated,
//   },
//   admin: {
//     useAsTitle: 'title',
//   },
//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       required: true,
//     },
//     slugField({
//       position: undefined,
//     }),
//   ],
// }
import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    slugField({
      position: undefined,
    }),

    // ⭐ ДОДАНЕ ПОЛЕ МЕДІА
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media', // ← назва колекції медіафайлів
      label: 'Hero image',
      required: false,
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Пости категорії',
      required: false,
      // ⚡ тут не ставимо fields
    },
  ],
}
