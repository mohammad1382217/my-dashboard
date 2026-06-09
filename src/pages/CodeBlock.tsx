import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { useLang } from '../i18n'
import { Icon } from '../components/Icon'

const STRINGS = {
  fa: { copy: 'کپی', copied: 'کپی شد!', download: 'دانلود' },
  en: { copy: 'Copy', copied: 'Copied!', download: 'Download' },
} as const

const headerButton =
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100'

interface CodeBlockProps {
  code: string
  /** When set, shows the file name as the badge and enables the download button. */
  filename?: string
}

/**
 * Dark, syntax-highlighted source view with copy (+ optional download). Always
 * LTR — code reads left-to-right even when the surrounding UI is RTL.
 */
export function CodeBlock({ code, filename }: CodeBlockProps) {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [copied, setCopied] = useState(false)
  const source = code.trim()

  const copy = () => {
    if (!navigator.clipboard) return
    void navigator.clipboard.writeText(source).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      },
      () => {},
    )
  }

  const download = () => {
    if (!filename) return
    const blob = new Blob([source], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div dir="ltr" className="bg-zinc-950 text-left">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="truncate font-mono text-xs text-zinc-500">{filename ?? 'tsx'}</span>
        <div className="flex shrink-0 items-center gap-1">
          {filename ? (
            <button type="button" onClick={download} className={headerButton}>
              <Icon name="download" size={14} />
              {t.download}
            </button>
          ) : null}
          <button type="button" onClick={copy} className={headerButton}>
            <Icon name={copied ? 'check' : 'copy'} size={14} />
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>

      <Highlight code={source} language="tsx" theme={themes.vsDark}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="max-h-[60vh] overflow-auto p-4 text-[13px] leading-relaxed">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
