import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/search/autocomplete - Get search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, cities, properties

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    let suggestions: any[] = []

    if (type === 'cities' || type === 'all') {
      // Get city suggestions
      const cities = await prisma.property.groupBy({
        by: ['city'],
        where: {
          isPublished: true,
          city: {
            contains: query
          }
        },
        _count: {
          city: true
        },
        orderBy: {
          _count: {
            city: 'desc'
          }
        },
        take: 5
      })

      suggestions.push(...cities.map(city => ({
        type: 'city',
        text: city.city,
        subtitle: `${city._count.city} propriétés`,
        value: city.city
      })))
    }

    if (type === 'properties' || type === 'all') {
      // Get property title suggestions
      const properties = await prisma.property.findMany({
        where: {
          isPublished: true,
          title: {
            contains: query
          }
        },
        select: {
          id: true,
          title: true,
          city: true,
          type: true,
          price: true
        },
        orderBy: {
          views: 'desc'
        },
        take: 5
      })

      suggestions.push(...properties.map(property => ({
        type: 'property',
        text: property.title,
        subtitle: `${property.city} • ${property.type} • €${property.price.toLocaleString()}`,
        value: property.title,
        id: property.id
      })))
    }

    // Get address suggestions
    const addresses = await prisma.property.findMany({
      where: {
        isPublished: true,
        address: {
          contains: query
        }
      },
      select: {
        address: true,
        city: true,
        zipCode: true
      },
      distinct: ['address'],
      take: 3
    })

    suggestions.push(...addresses.map(address => ({
      type: 'address',
      text: address.address,
      subtitle: `${address.zipCode} ${address.city}`,
      value: address.address
    })))

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.value === suggestion.value)
      )
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: uniqueSuggestions
    })

  } catch (error) {
    console.error('Error in autocomplete:', error)
    return NextResponse.json(
      { success: false, error: 'Autocomplete failed' },
      { status: 500 }
    )
  }
}
