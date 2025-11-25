import type { Block } from 'payload'

export const CategoriesBlock: Block = {
  slug: 'categoriesBlock',
  labels: {
    singular: 'Categories Block',
    plural: 'Categories Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: false,
      label: 'Заголовок',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media', // або твоя колекція медіа
      required: false,
      label: 'Зображення категорії',
    },
  ],
}
