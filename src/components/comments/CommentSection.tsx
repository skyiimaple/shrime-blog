'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type Comment = {
  id: string
  authorName: string
  content: string
  createdAt: string
  parent?: string | { id: string } | null
}

type CommentSectionProps = {
  postId: string
  locale: string
}

export function CommentSection({ postId, locale }: CommentSectionProps) {
  const t = useTranslations('comments')
  const [comments, setComments] = useState<Comment[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    async function loadComments() {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()
      setComments(data.comments || [])
      setLoaded(true)
      setLoadingComments(false)
    }

    void loadComments()
  }, [postId])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName,
          authorEmail,
          content,
          parentId,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed')
      }

      setAuthorName('')
      setAuthorEmail('')
      setContent('')
      setParentId(null)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const topLevel = comments.filter((comment) => !comment.parent)
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
    const parent =
      typeof comment.parent === 'object' && comment.parent ? comment.parent.id : comment.parent

    if (parent) {
      acc[parent] = acc[parent] || []
      acc[parent].push(comment)
    }

    return acc
  }, {})

  return (
    <section className="mt-12 border-t border-border pt-8">
      <SectionTitle className="mb-6">{t('title')}</SectionTitle>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        {parentId && (
          <p className="text-xs text-muted">
            {t('reply')} #{parentId.slice(0, 6)}
            <button
              type="button"
              className="ml-2 text-accent"
              onClick={() => setParentId(null)}
            >
              ×
            </button>
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">{t('name')}</span>
            <input
              required
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">{t('email')}</span>
            <input
              required
              type="email"
              value={authorEmail}
              onChange={(event) => setAuthorEmail(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">{t('content')}</span>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>

        {status === 'success' && <p className="text-sm text-success">{t('success')}</p>}
        {status === 'error' && <p className="text-sm text-danger">{t('error')}</p>}
      </form>

      <div className="space-y-4">
        {loadingComments && <p className="text-sm text-muted">...</p>}
        {!loadingComments && topLevel.length === 0 && loaded && (
          <p className="text-sm text-muted">{t('empty')}</p>
        )}

        {topLevel.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <strong className="text-sm">{comment.authorName}</strong>
              <time className="text-xs text-muted">
                {new Date(comment.createdAt).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
              </time>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6">{comment.content}</p>
            <button
              type="button"
              className="mt-3 text-xs text-accent"
              onClick={() => setParentId(comment.id)}
            >
              {t('reply')}
            </button>

            {(repliesByParent[comment.id] || []).map((reply) => (
              <div key={reply.id} className="mt-4 border-l border-border pl-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <strong className="text-sm">{reply.authorName}</strong>
                  <time className="text-xs text-muted">
                    {new Date(reply.createdAt).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6">{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
