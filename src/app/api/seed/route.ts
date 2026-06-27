import { getPayloadClient } from '@/lib/payload'
import { seedDatabase } from '@/lib/seed'
import { NextResponse } from 'next/server'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const payload = await getPayloadClient()
    const result = await seedDatabase(payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
