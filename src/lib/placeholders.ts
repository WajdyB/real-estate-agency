// Placeholder image utilities
export const getRandomPropertyImage = (): string => {
  const propertyImages = [
    '/images/placeholders/property-1.svg',
    '/images/placeholders/property-2.svg',
    '/images/placeholders/property-3.svg',
    '/images/placeholders/property-4.svg',
    '/images/placeholders/property-5.svg',
  ]
  return propertyImages[Math.floor(Math.random() * propertyImages.length)]
}

export const getRandomAvatarImage = (): string => {
  const avatarImages = [
    '/images/placeholders/avatar-1.svg',
    '/images/placeholders/avatar-2.svg',
    '/images/placeholders/avatar-3.svg',
  ]
  return avatarImages[Math.floor(Math.random() * avatarImages.length)]
}

export const getRandomBlogImage = (): string => {
  const blogImages = [
    '/images/placeholders/blog-1.svg',
    '/images/placeholders/blog-2.svg',
  ]
  return blogImages[Math.floor(Math.random() * blogImages.length)]
}

export const getPropertyImageByType = (type: string): string => {
  switch (type) {
    case 'APARTMENT':
      return '/images/placeholders/property-2.svg'
    case 'HOUSE':
      return '/images/placeholders/property-3.svg'
    case 'STUDIO':
      return '/images/placeholders/property-4.svg'
    default:
      return '/images/placeholders/property-1.svg'
  }
}
