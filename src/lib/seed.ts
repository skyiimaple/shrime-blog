import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Payload } from 'payload'
import type { Post } from '@/payload-types'

type PostContent = NonNullable<Post['content']>

function richText(...paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  } as SerializedEditorState
}

const samplePosts = [
  {
    slug: 'build-blog-with-nextjs',
    translationGroup: 'build-blog',
    category: 'tech' as const,
    zh: {
      title: '用 Next.js 搭建个人博客',
      excerpt: '从框架选型到部署上线，记录我搭建 Maple\'s Blog 的完整过程。',
      content: richText(
        '选择 Next.js 是因为它兼顾了开发体验与性能：App Router、Server Components、以及和 Payload CMS 的无缝集成。',
        '本文会分享项目结构、多语言方案，以及如何让博客在保持开发者风格的同时，也适合生活类内容的阅读体验。',
      ),
    },
    en: {
      title: 'Building a Personal Blog with Next.js',
      excerpt: 'From stack selection to deployment — how I built Maple\'s Blog.',
      content: richText(
        'Next.js offers a great balance of developer experience and performance with App Router and Server Components.',
        'This post covers project structure, i18n setup, and keeping a developer-friendly UI that still works for lifestyle content.',
      ),
    },
    tags: ['nextjs', 'payload'],
  },
  {
    slug: 'typescript-tips',
    translationGroup: 'typescript-tips',
    category: 'tech' as const,
    zh: {
      title: 'TypeScript 实用小技巧',
      excerpt: '几个日常开发中真正用得上的 TS 技巧，简洁但有效。',
      content: richText(
        '善用 `satisfies` 可以在保持类型推断的同时做约束；用 discriminated union 让状态机更清晰。',
        '类型不是负担，而是帮你少写 bug 的工具——关键是找到适合自己项目的粒度。',
      ),
    },
    en: {
      title: 'Practical TypeScript Tips',
      excerpt: 'A few TS tricks I actually use day to day.',
      content: richText(
        'Use `satisfies` to constrain values while preserving inference. Discriminated unions make state machines clearer.',
        'Types are not the enemy — the goal is finding the right level of strictness for your project.',
      ),
    },
    tags: ['typescript'],
  },
  {
    slug: 'weekend-city-walk',
    translationGroup: 'city-walk',
    category: 'life' as const,
    zh: {
      title: '周末的城市漫步',
      excerpt: '不带目的地的散步，往往是最好的充电方式。',
      content: richText(
        '周日下午，阳光刚好。从家出发，沿着河边走了一个多小时，路过一家新开的咖啡店，点了一杯美式。',
        '有时候我们需要从屏幕前离开，让思绪慢下来。城市的声音、风、和陌生人的笑脸，都是生活的一部分。',
      ),
    },
    en: {
      title: 'A Weekend City Walk',
      excerpt: 'Sometimes the best recharge is a walk with no destination.',
      content: richText(
        'On a sunny afternoon I walked along the river for over an hour and stopped at a newly opened café for an americano.',
        'Stepping away from the screen slows your thoughts. City sounds, breeze, and strangers\' smiles are part of life too.',
      ),
    },
    tags: ['life', 'city'],
  },
  {
    slug: 'kitchen-experiments',
    translationGroup: 'kitchen',
    category: 'life' as const,
    zh: {
      title: '厨房里的实验',
      excerpt: '第一次做舒芙蕾：失败两次，第三次终于成功。',
      content: richText(
        '写代码和做菜其实有点像：配方是文档，火候是 timing，失败是 debug。',
        '第三次尝试时，舒芙蕾终于蓬松地立了起来。那一刻的成就感，和修完一个 bug 一模一样。',
      ),
    },
    en: {
      title: 'Kitchen Experiments',
      excerpt: 'My first soufflé: two failures, success on the third try.',
      content: richText(
        'Cooking is a lot like coding: recipes are docs, heat is timing, and failures are debugging sessions.',
        'On the third attempt the soufflé finally rose. The satisfaction felt exactly like fixing a stubborn bug.',
      ),
    },
    tags: ['life', 'food'],
  },
]

const sampleTags = [
  { slug: 'nextjs', zh: 'Next.js', en: 'Next.js', color: '#0070f3' },
  { slug: 'payload', zh: 'Payload', en: 'Payload', color: '#38bdf8' },
  { slug: 'typescript', zh: 'TypeScript', en: 'TypeScript', color: '#3178c6' },
  { slug: 'life', zh: '生活', en: 'Life', color: '#059669' },
  { slug: 'city', zh: '城市', en: 'City', color: '#0891b2' },
  { slug: 'food', zh: '美食', en: 'Food', color: '#d97706' },
]

export async function seedDatabase(payload: Payload) {
  const existing = await payload.find({ collection: 'posts', limit: 1 })
  if (existing.totalDocs > 0) {
    return { skipped: true, message: 'Database already has posts' }
  }

  const tagIds: Record<string, number | string> = {}

  for (const tag of sampleTags) {
    const created = await payload.create({
      collection: 'tags',
      locale: 'zh',
      data: { name: tag.zh, slug: tag.slug, color: tag.color },
    })
    await payload.update({
      collection: 'tags',
      id: created.id,
      locale: 'en',
      data: { name: tag.en },
    })
    tagIds[tag.slug] = created.id
  }

  const now = Date.now()
  const createdPosts: string[] = []

  for (const [index, post] of samplePosts.entries()) {
    const publishedAt = new Date(now - index * 86400000).toISOString()
    const tagRelations = post.tags.map((slug) => tagIds[slug]).filter(Boolean)

    const created = await payload.create({
      collection: 'posts',
      locale: 'zh',
      draft: false,
      data: {
        title: post.zh.title,
        slug: post.slug,
        excerpt: post.zh.excerpt,
        content: post.zh.content as PostContent,
        category: post.category,
        publishedAt,
        translationGroup: post.translationGroup,
        tags: tagRelations as number[],
        _status: 'published',
      },
    })

    await payload.update({
      collection: 'posts',
      id: created.id,
      locale: 'en',
      draft: false,
      data: {
        title: post.en.title,
        excerpt: post.en.excerpt,
        content: post.en.content as PostContent,
        _status: 'published',
      },
    })

    createdPosts.push(post.zh.title)
  }

  return { skipped: false, createdPosts }
}
