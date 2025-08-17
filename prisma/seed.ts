import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agence-immobiliere.fr' },
    update: {},
    create: {
      email: 'admin@agence-immobiliere.fr',
      name: 'Administrateur',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 10)
  
  const agent = await prisma.user.upsert({
    where: { email: 'agent@agence-immobiliere.fr' },
    update: {},
    create: {
      email: 'agent@agence-immobiliere.fr',
      name: 'Agent Immobilier',
      password: agentPassword,
      role: 'AGENT',
      phone: '+33 1 23 45 67 89',
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
      title: 'Appartement moderne 3 pièces - Paris 15ème',
      description: 'Magnifique appartement de 75m² entièrement rénové avec goût. Situé au 4ème étage avec ascenseur, il offre une vue dégagée sur un jardin privatif. Composé d\'un séjour lumineux, 2 chambres, cuisine équipée, salle de bain moderne et WC séparé. Proche métro et commerces.',
      price: 485000,
      type: 'APARTMENT' as const,
      surface: 75,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      floor: 4,
      totalFloors: 6,
      yearBuilt: 1970,
      energyClass: 'C',
      address: '25 Rue de la Convention',
      city: 'Paris',
      zipCode: '75015',
      latitude: 48.8434,
      longitude: 2.2945,
      features: {
        elevator: true,
        balcony: false,
        parking: false,
        cellar: true,
        garden: false,
        terrace: false,
      },
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Maison familiale 5 pièces avec jardin - Neuilly-sur-Seine',
      description: 'Belle maison bourgeoise de 120m² sur 3 niveaux avec jardin de 200m². Idéale pour une famille, elle propose un salon-séjour de 35m², cuisine moderne ouverte, 4 chambres dont une suite parentale, 2 salles de bain. Garage et cave. Quartier résidentiel calme.',
      price: 1250000,
      type: 'HOUSE' as const,
      surface: 120,
      rooms: 5,
      bedrooms: 4,
      bathrooms: 2,
      yearBuilt: 1985,
      energyClass: 'D',
      address: '12 Avenue du Général de Gaulle',
      city: 'Neuilly-sur-Seine',
      zipCode: '92200',
      latitude: 48.8846,
      longitude: 2.2691,
      features: {
        elevator: false,
        balcony: false,
        parking: true,
        cellar: true,
        garden: true,
        terrace: true,
      },
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Studio lumineux - Quartier Latin',
      description: 'Charmant studio de 25m² au coeur du Quartier Latin. Entièrement meublé et équipé, il dispose d\'un coin nuit en mezzanine, d\'un séjour avec kitchenette et d\'une salle d\'eau moderne. Idéal investissement locatif ou pied-à-terre parisien.',
      price: 295000,
      type: 'STUDIO' as const,
      surface: 25,
      rooms: 1,
      bedrooms: 0,
      bathrooms: 1,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 1900,
      energyClass: 'E',
      address: '8 Rue de la Huchette',
      city: 'Paris',
      zipCode: '75005',
      latitude: 48.8529,
      longitude: 2.3469,
      features: {
        elevator: false,
        balcony: false,
        parking: false,
        cellar: false,
        garden: false,
        terrace: false,
      },
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
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
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      isPublished: true,
    },
    {
      title: 'Tendances du marché immobilier 2024',
      slug: 'tendances-marche-immobilier-2024',
      excerpt: 'Analyse des tendances et prévisions pour le marché immobilier français.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800',
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
    { key: 'contact_email', value: 'contact@agence-immobiliere.fr', description: 'Email de contact' },
    { key: 'contact_phone', value: '+33 1 23 45 67 89', description: 'Téléphone de contact' },
    { key: 'contact_address', value: '123 Avenue des Champs-Élysées, 75008 Paris', description: 'Adresse de l\'agence' },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
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
