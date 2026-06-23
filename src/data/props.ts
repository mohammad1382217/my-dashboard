/**
 * Lightweight prop-table extractor. Each component's source is bundled as raw text
 * (registry `?raw` imports); we parse its `XxxProps` interface body for the
 * component-specific props — JSDoc comment → description, `?` → optional, the
 * annotation → type — and read defaults from the function's parameter destructure.
 *
 * Deliberately best-effort and dependency-free: it handles the kit's consistent,
 * single-line-prop style and degrades to an empty list for shapes it can't parse
 * (e.g. discriminated-union prop types), so a component simply shows no table.
 */
export interface PropInfo {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

/** Slice the `{ … }` that starts at `open` (index of the opening brace), brace-matched. */
function matchBraces(source: string, open: number): { body: string; end: number } {
  let depth = 1
  let i = open + 1
  for (; i < source.length && depth > 0; i += 1) {
    const ch = source[i]
    if (ch === '{') depth += 1
    else if (ch === '}') depth -= 1
  }
  return { body: source.slice(open + 1, i - 1), end: i }
}

/** Read simple literal defaults from the component's first (destructured) parameter. */
function extractDefaults(source: string, code: string): Record<string, string> {
  const out: Record<string, string> = {}
  const fn = new RegExp(`function ${code}\\b`).exec(source)
  if (!fn) return out
  const paren = source.indexOf('(', fn.index)
  if (paren < 0) return out
  // Find the destructure `{` that lives inside the parameter list (before params close).
  let depth = 1
  let brace = -1
  for (let i = paren + 1; i < source.length && depth > 0; i += 1) {
    const ch = source[i]
    if (ch === '(') depth += 1
    else if (ch === ')') depth -= 1
    else if (ch === '{' && depth >= 1) {
      brace = i
      break
    }
  }
  if (brace < 0) return out
  const { body } = matchBraces(source, brace)
  const re = /([A-Za-z_$][\w$]*)\s*=\s*('[^']*'|"[^"]*"|`[^`]*`|true|false|-?[\d.]+|[A-Za-z_$][\w$.]*)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) out[m[1]] = m[2]
  return out
}

export function extractProps(source: string, code: string): PropInfo[] {
  try {
    const header = new RegExp(`export interface ${code}Props(?:<[^>]*>)?[^{]*\\{`).exec(source)
    if (!header) return []
    const { body } = matchBraces(source, header.index + header[0].length - 1)
    const defaults = extractDefaults(source, code)

    const props: PropInfo[] = []
    let desc: string[] = []
    let inDoc = false

    for (const rawLine of body.split('\n')) {
      const line = rawLine.trim()
      if (!line) continue

      if (!inDoc && line.startsWith('/**')) {
        const inline = line.replace(/\/\*\*|\*\//g, '').trim()
        desc = inline ? [inline] : []
        inDoc = !line.includes('*/')
        continue
      }
      if (inDoc) {
        const text = line.replace(/\*\/.*/, '').replace(/^\*\s?/, '').trim()
        if (text) desc.push(text)
        if (line.includes('*/')) inDoc = false
        continue
      }

      const member = /^([A-Za-z_$][\w$]*)(\?)?\s*:\s*(.+?);?$/.exec(line)
      if (member) {
        const name = member[1]
        props.push({
          name,
          required: !member[2],
          type: member[3].replace(/;$/, '').trim(),
          default: defaults[name],
          description: desc.join(' ') || undefined,
        })
      }
      desc = []
    }
    return props
  } catch {
    return []
  }
}
