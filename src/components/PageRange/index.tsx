import React from 'react'

const defaultLabels = {
  singular: 'документа',
  few: 'документи',
  plural: 'документів',
}

const defaultCollectionLabels = {
  posts: {
    singular: 'публікацію',
    few: 'публікацій',
    plural: 'публікацій',
  },
}

function getUkrainianPlural(
  number: number,
  forms: { singular: string; few: string; plural: string },
) {
  const lastDigit = number % 10
  const lastTwoDigits = number % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms.plural

  if (lastDigit === 1) return forms.singular
  if (lastDigit >= 2 && lastDigit <= 4) return forms.few

  return forms.plural
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    singular?: string
    few?: string
    plural?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  // 🔥 Гарантовано заповнюємо всі поля
  const labels = {
    ...defaultLabels,
    ...(collection ? defaultCollectionLabels[collection] : {}),
    ...(collectionLabelsFromProps || {}),
  }

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Пошук не дав результатів.'}

      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `Показано ${indexStart}${indexStart > 0 ? ` — ${indexEnd}` : ''} із ${totalDocs} ${getUkrainianPlural(totalDocs, labels)}`}
    </div>
  )
}

