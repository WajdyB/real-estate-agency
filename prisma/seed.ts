import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agence.tn' },
    update: {},
    create: {
      email: 'admin@agence.tn',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 10)
  
  const agent = await prisma.user.upsert({
    where: { email: 'agent@agence.tn' },
    update: {},
    create: {
      email: 'agent@agence.tn',
      name: 'Agent',
      password: agentPassword,
      role: 'AGENT',
      phone: '+216 71 234 567',
      isActive: true,
    },
  })

  // Create sample properties
  const properties: Array<{
    title: string;
    description: string;
    price: number;
    type: 'APARTMENT' | 'HOUSE' | 'STUDIO';
    surface: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    floor?: number;
    totalFloors?: number;
    yearBuilt: number;
    energyClass: string;
    address: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    features: {
      elevator: boolean;
      balcony: boolean;
      parking: boolean;
      cellar: boolean;
      garden: boolean;
      terrace: boolean;
    };
    images: string[];
    isPublished: boolean;
    isFeatured: boolean;
  }> = [
    {
      title: 'Appartement moderne 3 pièces - Centre Ville Tunis',
      description: 'Magnifique appartement de 75m² entièrement rénové avec goût. Situé au 4ème étage avec ascenseur, il offre une vue dégagée sur un jardin privatif. Composé d\'un séjour lumineux, 2 chambres, cuisine équipée, salle de bain moderne et WC séparé. Proche métro léger et commerces.',
      price: 350000,
      type: 'APARTMENT' as const,
      surface: 75,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      floor: 4,
      totalFloors: 6,
      yearBuilt: 1970,
      energyClass: 'C',
      address: 'Avenue Habib Bourguiba',
      city: 'Tunis',
      zipCode: '1001',
      latitude: 36.8065,
      longitude: 10.1815,
      features: {
        elevator: true,
        balcony: false,
        parking: false,
        cellar: true,
        garden: false,
        terrace: false,
      },
             images: [
         '/images/placeholders/property-1.svg'
       ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Villa familiale 5 pièces avec jardin - La Marsa',
      description: 'Belle villa moderne de 120m² sur 2 niveaux avec jardin de 200m². Idéale pour une famille, elle propose un salon-séjour de 35m², cuisine moderne ouverte, 4 chambres dont une suite parentale, 2 salles de bain. Garage et cave. Quartier résidentiel calme près de la plage.',
      price: 800000,
      type: 'HOUSE' as const,
      surface: 120,
      rooms: 5,
      bedrooms: 4,
      bathrooms: 2,
      yearBuilt: 1985,
      energyClass: 'D',
      address: 'Avenue Habib Thameur',
      city: 'La Marsa',
      zipCode: '2078',
      latitude: 36.8783,
      longitude: 10.3247,
      features: {
        elevator: false,
        balcony: false,
        parking: true,
        cellar: true,
        garden: true,
        terrace: true,
      },
             images: [
         '/images/placeholders/property-2.svg'
       ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Studio lumineux - Bab Bhar',
      description: 'Charmant studio de 25m² au coeur de Bab Bhar. Entièrement meublé et équipé, il dispose d\'un coin nuit en mezzanine, d\'un séjour avec kitchenette et d\'une salle d\'eau moderne. Idéal investissement locatif ou pied-à-terre tunisois.',
      price: 180000,
      type: 'STUDIO' as const,
      surface: 25,
      rooms: 1,
      bedrooms: 0,
      bathrooms: 1,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 1900,
      energyClass: 'E',
      address: 'Rue de la Kasbah',
      city: 'Tunis',
      zipCode: '1008',
      latitude: 36.7969,
      longitude: 10.1717,
      features: {
        elevator: false,
        balcony: false,
        parking: false,
        cellar: false,
        garden: false,
        terrace: false,
      },
             images: [
         '/images/placeholders/property-3.svg'
       ],
      isPublished: true,
      isFeatured: false,
    },
  ]

  for (const propertyData of properties) {
    await prisma.property.create({
      data: {
        ...propertyData,
        userId: agent.id,
      },
    })
  }

  // Create blog posts
  const blogPosts = [
    {
      title: 'Guide complet pour acheter son premier appartement',
      slug: 'guide-premier-achat-appartement',
      excerpt: 'Tous nos conseils pour réussir votre premier achat immobilier sans stress.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
             image: '/images/placeholders/blog-1.svg',
      isPublished: true,
    },
    {
      title: 'Tendances du marché immobilier 2024',
      slug: 'tendances-marche-immobilier-2024',
      excerpt: 'Analyse des tendances et prévisions pour le marché immobilier français.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
             image: '/images/placeholders/blog-2.svg',
      isPublished: true,
    },
  ]

  for (const blogPost of blogPosts) {
    await prisma.blogPost.create({
      data: blogPost,
    })
  }

  // Create settings
  const settings = [
    { key: 'site_name', value: 'Agence Immobilière Premium', description: 'Nom du site' },
    { key: 'site_description', value: 'Votre partenaire immobilier de confiance', description: 'Description du site' },
    { key: 'contact_email', value: 'contact@agence.fr', description: 'Email de contact' },
    { key: 'contact_phone', value: '+216 71 500 200', description: 'Téléphone de contact' },
    { key: 'contact_address', value: 'Avenue Habib Bourguiba, Monastir', description: 'Adresse de l\'agence' },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  // Create sample messages
  const messages = [
    {
      userId: admin.id,
      name: 'Ahmed Ben Salah',
      email: 'ahmed.ben.salah@gmail.com',
      phone: '+216 97 230 151',
      subject: 'Demande de visite - Appartement Tunis 15ème',
      message: 'Bonjour, je suis intéressée par l\'appartement 3 pièces à Tunis 15ème. Serait-il possible d\'organiser une visite ?',
      status: 'PENDING' as const,
    },
    {
      userId: admin.id,
      name: 'Amal Haddadi',
      email: 'amal.h@gmail.com',
      phone: '+216 29 311 162',
      subject: 'Question sur la villa à Sousse',
      message: 'Bonjour, j\'aimerais des informations supplémentaires sur la villa à Sousse. Quels sont les frais de notaire ?',
      status: 'READ' as const,
    },
    {
      userId: admin.id,
      name: 'Mounir Ben Arfa',
      email: 'mounir.arfa@gmail.com',
      phone: '+216 90 123 456',
      subject: 'Réservation pour location courte durée',
      message: 'Je souhaite réserver le studio à Monastir pour la semaine du 15 au 22 février. Est-ce disponible ?',
      status: 'REPLIED' as const,
      response: 'Bonjour Mounir, le studio est disponible pour ces dates. Je vous envoie les détails par email.',
    },
  ]

  for (const messageData of messages) {
    await prisma.message.create({
      data: messageData,
    })
  }



  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
