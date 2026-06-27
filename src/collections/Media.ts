import path from 'path'
import { fileURLToPath } from 'url'
import { APIError, type CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const REMOTE_IMAGE_HOSTS = [
  { hostname: 'img.hy.fun', protocol: 'https' as const },
  { hostname: 'img.lty.fun', protocol: 'https' as const },
  { hostname: 'hy.fun', protocol: 'https' as const },
  { hostname: 'lty.fun', protocol: 'https' as const },
  { hostname: 'localhost', protocol: 'http' as const },
  { hostname: '127.0.0.1', protocol: 'http' as const },
]

function assertDirectImageUrl(url: string) {
  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    throw new APIError('请输入有效的图片 URL。', 400)
  }

  const hasImagePath = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i.test(parsed.pathname)

  if (parsed.hash && !hasImagePath) {
    throw new APIError(
      '此链接是图床分享页，不是图片直链。请在图床使用「复制直链 / 复制 URL」，粘贴以 .png、.jpg 等结尾的地址。',
      400,
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description:
      '支持本地上传，或通过 Paste URL 粘贴图片直链。远程图床需在 Paste URL 中粘贴直链；分享页链接（含 #pid=）无法导入。',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    pasteURL: {
      allowList: REMOTE_IMAGE_HOSTS,
    },
    skipSafeFetch: REMOTE_IMAGE_HOSTS,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.url === 'string' && data.url.startsWith('http')) {
          assertDirectImageUrl(data.url)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}
