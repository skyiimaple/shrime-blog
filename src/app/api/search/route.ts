import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/search'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || ''
  const locale = request.nextUrl.searchParams.get('locale') || 'zh'

  if (!query.trim()) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchPosts(query, locale)
  return NextResponse.json({ results })
}
