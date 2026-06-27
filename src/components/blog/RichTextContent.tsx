import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type RichTextContentProps = {
  data: SerializedEditorState
}

export function RichTextContent({ data }: RichTextContentProps) {
  return (
    <div className="prose prose-invert max-w-none leading-7 text-foreground [&_a]:text-accent [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_li]:my-1 [&_ol]:my-4 [&_p]:my-4 [&_ul]:my-4">
      <RichText data={data} />
    </div>
  )
}
