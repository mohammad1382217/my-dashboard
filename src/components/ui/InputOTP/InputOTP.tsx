import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react'
import type {
  ChangeEvent,
  ClipboardEvent as ReactClipboardEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { twMerge } from 'tailwind-merge'

export interface InputOTPProps {
  /** Number of single-character slots. Defaults to 6. */
  length?: number
  /** Controlled value (digits only). Pair with `onChange`. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Fires with the next combined value as the user edits. */
  onChange?: (value: string) => void
  /** Fires once every slot is filled. */
  onComplete?: (value: string) => void
  /** Disable every slot. */
  disabled?: boolean
  /** Group label rendered above the slots. */
  label?: ReactNode
  /** Hint shown below the slots. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Hidden input name, so the combined value submits with a native <form>. */
  name?: string
  /** Focus the first slot on mount. */
  autoFocus?: boolean
  /** Merged onto the slots row. */
  className?: string
}

/** Numeric, capped to `length`. */
function sanitize(value: string, length: number): string {
  return value.replace(/\D/g, '').slice(0, length)
}

const slotBase =
  'h-11 w-9 rounded-md border bg-white text-center text-lg font-medium text-slate-900 outline-none transition-[color,background-color,border-color,box-shadow,transform] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100'

const slotNormal =
  'border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:focus:border-primary-400'

const slotError = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'

/**
 * Segmented one-time-password input: `length` single-character slots that
 * auto-advance as you type, move back + clear on Backspace, accept a full pasted
 * code, and navigate with the arrow keys. The slots row is forced to LTR so the
 * code is always entered left-to-right, even in an RTL UI. Controlled
 * (`value` + `onChange`) or uncontrolled (`defaultValue`); `onComplete` fires
 * when full. The ref points at the first slot; pass `name` to submit the
 * combined value via a hidden input in a native form.
 */
export const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(function InputOTP(
  { length = 6, value, defaultValue, onChange, onComplete, disabled, label, helperText, error, name, autoFocus, className },
  ref,
) {
  const id = useId()
  const labelId = `${id}-label`
  const helperId = `${id}-helper`
  const errorId = `${id}-error`

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(() => sanitize(defaultValue ?? '', length))
  const otp = isControlled ? sanitize(value ?? '', length) : internal

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined

  const slotsRef = useRef<Array<HTMLInputElement | null>>([])
  useImperativeHandle(ref, () => slotsRef.current[0] as HTMLInputElement, [])

  function commit(nextChars: string[]) {
    const next = sanitize(nextChars.join(''), length)
    if (!isControlled) setInternal(next)
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }

  function focusSlot(index: number) {
    const target = slotsRef.current[Math.max(0, Math.min(length - 1, index))]
    target?.focus()
    target?.select()
  }

  function place(fromIndex: number, raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return
    const chars = otp.split('')
    let index = fromIndex
    for (const digit of digits) {
      if (index >= length) break
      chars[index] = digit
      index += 1
    }
    commit(chars)
    focusSlot(index)
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    place(index, event.target.value)
  }

  function handlePaste(index: number, event: ReactClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    place(index, event.clipboardData.getData('text'))
  }

  function handleKeyDown(index: number, event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault()
      const chars = otp.split('')
      if (chars[index]) {
        chars[index] = ''
        commit(chars)
      } else if (index > 0) {
        chars[index - 1] = ''
        commit(chars)
        focusSlot(index - 1)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusSlot(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusSlot(index + 1)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <span id={labelId} className="text-sm font-medium text-fg-soft">
          {label}
        </span>
      ) : null}

      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy}
        dir="ltr"
        className={twMerge('flex gap-2', className)}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(element) => {
              slotsRef.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            value={otp[index] ?? ''}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={hasError || undefined}
            autoFocus={autoFocus && index === 0}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
            className={twMerge(slotBase, hasError ? slotError : slotNormal)}
          />
        ))}
      </div>

      {name ? <input type="hidden" name={name} value={otp} /> : null}

      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})
