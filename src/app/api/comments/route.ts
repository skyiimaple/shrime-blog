import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

function parseId(value: unknown): number | null {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export async function GET(request: NextRequest) {
  const postId = parseId(request.nextUrl.searchParams.get('postId'))

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  const comments = await payload.find({
    collection: 'comments',
    where: {
      and: [{ post: { equals: postId } }, { status: { equals: 'approved' } }],
    },
    sort: 'createdAt',
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })

  return NextResponse.json({
    comments: comments.docs.map((comment) => ({
      id: comment.id,
      authorName: comment.authorName,
      content: comment.content,
      createdAt: comment.createdAt,
      parent: comment.parent,
    })),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, authorName, authorEmail, content, parentId, locale } = body

    const postIdNum = parseId(postId)

    if (!postIdNum || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (String(content).length > 2000 || String(authorName).length > 50) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 })
    }

    const parentIdNum = parentId ? parseId(parentId) : null
    if (parentId && !parentIdNum) {
      return NextResponse.json({ error: 'Invalid parent comment' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const post = await payload.findByID({
      collection: 'posts',
      id: postIdNum,
      overrideAccess: true,
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comment = await payload.create({
      collection: 'comments',
      data: {
        post: post.id,
        authorName: String(authorName).trim(),
        authorEmail: String(authorEmail).trim(),
        content: String(content).trim(),
        parent: parentIdNum ?? undefined,
        locale: locale === 'en' ? 'en' : 'zh',
        status: 'pending',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ id: comment.id, status: 'pending' }, { status: 201 })
  } catch (error) {
    console.error('[comments POST]', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
