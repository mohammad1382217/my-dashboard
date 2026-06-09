import type { Bilingual } from './registry'

export interface HookEntry {
  id: string
  /** Hook name, e.g. "useLocalStorage". */
  name: string
  /** Downloadable file name. */
  file: string
  category: Bilingual
  description: Bilingual
  /** Full, copy/paste-ready implementation. */
  code: string
}

const C = {
  state: { fa: 'وضعیت', en: 'State' },
  effects: { fa: 'افکت', en: 'Effects' },
  browser: { fa: 'مرورگر', en: 'Browser' },
  ui: { fa: 'رابط کاربری', en: 'UI' },
  data: { fa: 'داده', en: 'Data' },
} satisfies Record<string, Bilingual>

/**
 * A curated set of production-grade React hooks every app reaches for. Each is
 * self-contained, typed and copy/paste-ready (shown with copy + download in the
 * Hooks view).
 */
export const HOOKS: HookEntry[] = [
  {
    id: 'use-local-storage',
    name: 'useLocalStorage',
    file: 'useLocalStorage.ts',
    category: C.state,
    description: {
      fa: 'یک state که خودکار در localStorage ذخیره و بینِ تب‌ها همگام می‌شود.',
      en: 'A state value persisted to localStorage and synced across tabs.',
    },
    code: `import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [stored, setStored] = useState<T>(read)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore quota / private-mode errors
        }
        return next
      })
    },
    [key],
  )

  // Keep multiple tabs / hook instances in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) setStored(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, read])

  return [stored, setValue] as const
}`,
  },
  {
    id: 'use-debounce',
    name: 'useDebounce',
    file: 'useDebounce.ts',
    category: C.state,
    description: {
      fa: 'یک مقدار را با تأخیر برمی‌گرداند؛ ایده‌آل برای فیلدِ جست‌وجو.',
      en: 'Returns a value only after it stops changing for a delay — ideal for search inputs.',
    },
    code: `import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}`,
  },
  {
    id: 'use-previous',
    name: 'usePrevious',
    file: 'usePrevious.ts',
    category: C.state,
    description: {
      fa: 'مقدارِ رندرِ قبلی را نگه می‌دارد (برای مقایسهٔ before/after).',
      en: 'Holds the value from the previous render (compare before/after).',
    },
    code: `import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}`,
  },
  {
    id: 'use-toggle',
    name: 'useToggle',
    file: 'useToggle.ts',
    category: C.state,
    description: {
      fa: 'یک boolean با toggle و setترِ صریح.',
      en: 'A boolean with a toggle and an explicit setter.',
    },
    code: `import { useCallback, useState } from 'react'

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((v) => !v), [])
  return [on, toggle, setOn] as const
}`,
  },
  {
    id: 'use-update-effect',
    name: 'useUpdateEffect',
    file: 'useUpdateEffect.ts',
    category: C.effects,
    description: {
      fa: 'مثلِ useEffect ولی رندرِ اول را رد می‌کند (فقط روی آپدیت‌ها).',
      en: 'Like useEffect but skips the first render — runs only on updates.',
    },
    code: `import { useEffect, useRef } from 'react'
import type { DependencyList, EffectCallback } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}`,
  },
  {
    id: 'use-interval',
    name: 'useInterval',
    file: 'useInterval.ts',
    category: C.effects,
    description: {
      fa: 'setIntervalِ اعلانی؛ با delay=null متوقف می‌شود (الگوی Dan Abramov).',
      en: 'A declarative setInterval; pass delay=null to pause (Dan Abramov pattern).',
    },
    code: `import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => saved.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}`,
  },
  {
    id: 'use-event-listener',
    name: 'useEventListener',
    file: 'useEventListener.ts',
    category: C.effects,
    description: {
      fa: 'افزودنِ امنِ یک event listener با cleanup خودکار و handlerِ تازه.',
      en: 'Safely attach an event listener with auto-cleanup and a fresh handler.',
    },
    code: `import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | HTMLElement | null = typeof window !== 'undefined' ? window : null,
) {
  const saved = useRef(handler)

  useEffect(() => {
    saved.current = handler
  }, [handler])

  useEffect(() => {
    if (!element) return
    const listener = (event: Event) => saved.current(event as WindowEventMap[K])
    element.addEventListener(type, listener)
    return () => element.removeEventListener(type, listener)
  }, [type, element])
}`,
  },
  {
    id: 'use-media-query',
    name: 'useMediaQuery',
    file: 'useMediaQuery.ts',
    category: C.browser,
    description: {
      fa: 'به یک media query پاسخ می‌دهد (مثلِ (min-width: 768px)).',
      en: 'Subscribes to a media query, e.g. (min-width: 768px).',
    },
    code: `import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}`,
  },
  {
    id: 'use-window-size',
    name: 'useWindowSize',
    file: 'useWindowSize.ts',
    category: C.browser,
    description: {
      fa: 'عرض و ارتفاعِ پنجره را با resize به‌روز می‌کند.',
      en: 'Tracks the window width/height, updating on resize.',
    },
    code: `import { useEffect, useState } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}`,
  },
  {
    id: 'use-copy-to-clipboard',
    name: 'useCopyToClipboard',
    file: 'useCopyToClipboard.ts',
    category: C.browser,
    description: {
      fa: 'متن را در کلیپ‌بورد کپی می‌کند و وضعیتِ «کپی‌شد» را برمی‌گرداند.',
      en: 'Copies text to the clipboard and reports a transient "copied" state.',
    },
    code: `import { useCallback, useState } from 'react'

export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), resetMs)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [resetMs],
  )

  return [copied, copy] as const
}`,
  },
  {
    id: 'use-click-outside',
    name: 'useClickOutside',
    file: 'useClickOutside.ts',
    category: C.ui,
    description: {
      fa: 'کلیکِ بیرون از یک المان را تشخیص می‌دهد (بستنِ منو/مودال).',
      en: 'Detects a pointer-down outside a referenced element (close menus/modals).',
    },
    code: `import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const el = ref.current
      if (el && !el.contains(event.target as Node)) handler()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [handler])

  return ref
}`,
  },
  {
    id: 'use-on-screen',
    name: 'useOnScreen',
    file: 'useOnScreen.ts',
    category: C.ui,
    description: {
      fa: 'با IntersectionObserver می‌گوید یک المان داخلِ دید هست یا نه (lazy-load).',
      en: 'Reports whether an element is in view via IntersectionObserver (lazy-load).',
    },
    code: `import { useEffect, useRef, useState } from 'react'

export function useOnScreen<T extends HTMLElement>(rootMargin = '0px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, visible] as const
}`,
  },
  {
    id: 'use-hotkey',
    name: 'useHotkey',
    file: 'useHotkey.ts',
    category: C.ui,
    description: {
      fa: 'یک میان‌بُرِ کیبورد ثبت می‌کند، مثلِ "mod+k" (Ctrl/⌘+K).',
      en: 'Registers a keyboard shortcut such as "mod+k" (Ctrl/⌘+K).',
    },
    code: `import { useEffect } from 'react'

/** combo examples: "mod+k", "shift+?", "escape". "mod" = Ctrl on Win/Linux, ⌘ on macOS. */
export function useHotkey(combo: string, handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const parts = combo.toLowerCase().split('+')
    const key = parts[parts.length - 1]
    const needMod = parts.includes('mod')
    const needShift = parts.includes('shift')
    const needAlt = parts.includes('alt')

    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey
      if (event.key.toLowerCase() !== key) return
      if (needMod !== mod) return
      if (needShift !== event.shiftKey) return
      if (needAlt !== event.altKey) return
      handler(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, handler])
}`,
  },
  {
    id: 'use-fetch',
    name: 'useFetch',
    file: 'useFetch.ts',
    category: C.data,
    description: {
      fa: 'واکشیِ داده با حالت‌های loading/error/data و لغوِ خودکار (AbortController).',
      en: 'Data fetching with loading/error/data states and auto-abort on change/unmount.',
    },
    code: `import { useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json() as Promise<T>
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({ data: null, error: error as Error, loading: false })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return state
}`,
  },
  {
    id: 'use-is-mounted',
    name: 'useIsMounted',
    file: 'useIsMounted.ts',
    category: C.effects,
    description: {
      fa: 'بررسی می‌کند کامپوننت هنوز mount است (جلوگیری از setStateِ بعد از unmount).',
      en: 'Tells whether the component is still mounted (guard against post-unmount setState).',
    },
    code: `import { useCallback, useEffect, useRef } from 'react'

export function useIsMounted() {
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return useCallback(() => mounted.current, [])
}`,
  },
]
