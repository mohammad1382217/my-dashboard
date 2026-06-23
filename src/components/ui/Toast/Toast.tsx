/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type ToastType = 'success' | 'error' | 'warning' | 'default'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastOptions {
  /** Secondary line under the title. */
  description?: ReactNode
  /** Auto-dismiss delay in ms (overrides the provider default). */
  duration?: number
}

interface ToastItem {
  id: number
  type: ToastType
  title: ReactNode
  description?: ReactNode
  duration: number
}

interface ToastContextValue {
  add: (type: ToastType, title: ReactNode, options?: ToastOptions) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const REMOVE_DELAY = 200 // matches the leave transition

interface ToastVariant {
  card: string
  icon: string
  title: string
  desc: string
  close: string
}

// Fully tinted per type: a soft coloured background with stronger text + icon.
const variantClasses: Record<ToastType, ToastVariant> = {
  success: {
    card: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-200',
    desc: 'text-emerald-700 dark:text-emerald-300',
    close: 'text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-500/20',
  },
  error: {
    card: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-200',
    desc: 'text-red-700 dark:text-red-300',
    close: 'text-red-600 hover:bg-red-100 hover:text-red-900 dark:text-red-400 dark:hover:bg-red-500/20',
  },
  warning: {
    card: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-200',
    desc: 'text-amber-700 dark:text-amber-300',
    close: 'text-amber-600 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-500/20',
  },
  default: {
    card: 'border-slate-200 bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800',
    icon: 'text-muted',
    title: 'text-fg',
    desc: 'text-muted',
    close: 'text-slate-500 hover:bg-slate-200 hover:text-muted dark:hover:bg-zinc-700',
  },
}

function ToastIcon({ type, className }: { type: ToastType; className?: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: twMerge('mt-0.5 size-5 shrink-0', className),
  }
  if (type === 'success') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
    )
  }
  if (type === 'warning') {
    return (
      <svg {...common}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function ToastCard({
  toast,
  onDismiss,
  side,
}: {
  toast: ToastItem
  onDismiss: (id: number) => void
  side: 'top' | 'bottom'
}) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // Animate in a frame after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Auto-dismiss.
  useEffect(() => {
    const timer = window.setTimeout(() => setLeaving(true), toast.duration)
    return () => window.clearTimeout(timer)
  }, [toast.duration])

  // Remove after the leave transition has had time to play.
  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(() => onDismiss(toast.id), REMOVE_DELAY)
    return () => window.clearTimeout(timer)
  }, [leaving, onDismiss, toast.id])

  const shown = visible && !leaving
  const variant = variantClasses[toast.type]

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={twMerge(
        'pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-out motion-reduce:transition-none dark:ring-white/10',
        variant.card,
        shown
          ? 'opacity-100 transform-[translateY(0px)]'
          : side === 'top'
            ? 'opacity-0 transform-[translateY(-8px)]'
            : 'opacity-0 transform-[translateY(8px)]',
      )}
    >
      <ToastIcon type={toast.type} className={variant.icon} />
      <div className="min-w-0 flex-1">
        <p className={twMerge('text-sm font-medium', variant.title)}>{toast.title}</p>
        {toast.description ? (
          <p className={twMerge('mt-0.5 text-sm', variant.desc)}>{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label="Close"
        className={twMerge('-me-1 -mt-1 shrink-0 rounded-md p-1 outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98]', variant.close)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

// `flex-col-reverse` for top positions puts the newest toast nearest the edge.
const POSITIONS: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 flex-col-reverse',
  'top-center': 'top-4 left-1/2 transform-[translateX(-50%)] flex-col-reverse',
  'top-right': 'top-4 right-4 flex-col-reverse',
  'bottom-left': 'bottom-4 left-4 flex-col',
  'bottom-center': 'bottom-4 left-1/2 transform-[translateX(-50%)] flex-col',
  'bottom-right': 'bottom-4 right-4 flex-col',
}

function ToastViewport({
  toasts,
  onDismiss,
  position,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
  position: ToastPosition
}) {
  if (typeof document === 'undefined') return null
  const side: 'top' | 'bottom' = position.startsWith('top') ? 'top' : 'bottom'
  return createPortal(
    <div
      className={twMerge(
        'pointer-events-none fixed z-50 flex w-[calc(100%-2rem)] max-w-sm gap-2',
        POSITIONS[position],
      )}
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} side={side} />
      ))}
    </div>,
    document.body,
  )
}

/**
 * Provides the toast queue + viewport. Wrap your app once, then call `useToast()`
 * anywhere inside. Toasts auto-dismiss, animate in/out, render in a portal, and
 * use role="alert" for errors / role="status" otherwise.
 */
export function ToastProvider({
  children,
  duration = 4000,
  position = 'bottom-right',
}: {
  children: ReactNode
  duration?: number
  /** Where toasts appear. Defaults to "bottom-right". */
  position?: ToastPosition
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const add = useCallback(
    (type: ToastType, title: ReactNode, options?: ToastOptions) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [
        ...current,
        { id, type, title, description: options?.description, duration: options?.duration ?? duration },
      ])
      return id
    },
    [duration],
  )

  const value = useMemo<ToastContextValue>(() => ({ add, dismiss }), [add, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} position={position} />
    </ToastContext.Provider>
  )
}

export interface ToastApi {
  success: (title: ReactNode, options?: ToastOptions) => number
  error: (title: ReactNode, options?: ToastOptions) => number
  warning: (title: ReactNode, options?: ToastOptions) => number
  /** Neutral / gray toast. */
  message: (title: ReactNode, options?: ToastOptions) => number
  dismiss: (id: number) => void
}

/** Trigger toasts from anywhere inside a <ToastProvider>. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (ctx === null) throw new Error('useToast must be used within <ToastProvider>')
  return useMemo<ToastApi>(
    () => ({
      success: (title, options) => ctx.add('success', title, options),
      error: (title, options) => ctx.add('error', title, options),
      warning: (title, options) => ctx.add('warning', title, options),
      message: (title, options) => ctx.add('default', title, options),
      dismiss: ctx.dismiss,
    }),
    [ctx],
  )
}
