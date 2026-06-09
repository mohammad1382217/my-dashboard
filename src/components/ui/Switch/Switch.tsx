import { forwardRef, useId, useState } from 'react'
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { twMerge } from 'tailwind-merge'

/* -------------------------------------------------------------------------------------------------
 * Why this is built on a real <input type="checkbox" role="switch">
 * -------------------------------------------------------------------------------------------------
 * The input IS the control — it stays in the DOM (visually hidden with `sr-only`, NOT `hidden`, so
 * it keeps focus/tab order) rather than being replaced by a <button>. That buys us, for free:
 *   - native form submission: it serializes with `name`/`value`, supports `required`/`form`, and
 *     resets with the surrounding <form> — no hidden mirror input to keep in sync;
 *   - real checked semantics: Space toggles it, the browser owns checked state, and uncontrolled
 *     usage (`defaultChecked`) Just Works without any internal React state;
 *   - drift-proof a11y: `role="switch"` makes AT announce "on/off" (not "checked"), and the visual
 *     track reacts purely in CSS via the `peer-checked` / `peer-focus-visible` / `peer-disabled`
 *     variants, so the rendered pixels can never drift from the DOM/AT state.
 *
 * The sliding thumb animates with `transition-transform` only (translate-x), which downlevels safely
 * to old Chrome / Android 5; the track tint uses `transition-colors`. No layout-animating property.
 *
 * className target: `className` lands on the visual TRACK (the aria-hidden sibling), not the focusable
 * input — that is where consumers want to override `bg-*` / `h-*` / `rounded-*`. The focusable control
 * is `sr-only` and not meant to be restyled. This differs from Input/Select, where `className` lands on
 * the control itself; documented here so it is not surprising.
 * -----------------------------------------------------------------------------------------------*/

type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'role'> {
  /** Visible label rendered beside the switch and linked to it. */
  label?: string
  /** Render the label before the track instead of after. Defaults to "end". */
  labelPosition?: 'start' | 'end'
  /** Hint shown below the control. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Track / thumb scale. Defaults to "md". */
  size?: SwitchSize
  /** Decorative glyph(s) rendered inside the thumb (e.g. a check / cross icon). */
  thumbContent?: ReactNode
  /**
   * PRIMARY API. Fires the *next* boolean checked state, so `onCheckedChange={setOn}` works without
   * unwrapping a DOM event. Runs alongside the native `onChange`, which is also still available.
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * When true, Enter also toggles the switch (parity with a button). A native checkbox does NOT
   * toggle on Enter per spec — only Space does — so this is opt-in. Defaults to false (spec-correct).
   */
  toggleOnEnter?: boolean
}

/**
 * Per-size geometry. The thumb is inset ~2px on every side; `translate` moves it exactly
 * `trackWidth - thumbWidth - 2*inset` so the checked thumb lands flush against the far edge.
 */
const sizeClasses: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string; text: string }
> = {
  // `translate` uses the explicit `transform: translateX()` shorthand (NOT Tailwind's translate-x
  // utility, which emits the modern individual `translate` property — Chrome 104+ — that Lightning
  // CSS can't polyfill and that snaps on the Android 5 floor, exactly like the Accordion chevron).
  // The sign flips per direction: in RTL the thumb rests on the right (logical `start`) and must
  // slide LEFT (negative X) when checked, so we give ltr/rtl their own checked transform.
  sm: {
    track: 'h-4 w-7',
    thumb: 'h-3 w-3',
    translate: 'ltr:peer-checked:transform-[translateX(12px)] rtl:peer-checked:transform-[translateX(-12px)]',
    text: 'text-sm',
  },
  md: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'ltr:peer-checked:transform-[translateX(16px)] rtl:peer-checked:transform-[translateX(-16px)]',
    text: 'text-sm',
  },
  lg: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'ltr:peer-checked:transform-[translateX(20px)] rtl:peer-checked:transform-[translateX(-20px)]',
    text: 'text-base',
  },
}

// The track reacts to the sibling input purely via `peer-*` variants — no JS reads its checked state.
// `peer-disabled` is the SOLE source of the disabled dim (the label wrapper does not re-dim, to avoid
// double-dimming). `ring-offset-white` assumes a white surface, which is the house palette.
const trackBase =
  'relative inline-flex shrink-0 items-center rounded-full bg-slate-300 transition-colors dark:bg-zinc-700 ' +
  'peer-checked:bg-indigo-600 ' +
  'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-focus-visible:ring-indigo-500/40 ' +
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-60'

const trackError = 'bg-red-200 peer-checked:bg-red-600 peer-focus-visible:ring-red-500/40'

const thumbBase =
  'pointer-events-none absolute top-0.5 start-0.5 inline-flex items-center justify-center transform-[translateX(0px)] rounded-full bg-white text-[0.5rem] text-slate-600 shadow-sm transition-transform motion-reduce:transition-none'

/**
 * Form-friendly toggle Switch built on a real, visually-hidden
 * <input type="checkbox" role="switch"> kept in the DOM as the styling `peer`.
 *
 * Works controlled (`checked` + `onCheckedChange`/`onChange`) or uncontrolled (`defaultChecked`),
 * with an optional linked `label` (positionable via `labelPosition`), helper/error text, `disabled`,
 * `required`, sm/md/lg sizes and an optional `thumbContent` slot. Space toggles natively (Enter too,
 * if `toggleOnEnter`); the visual state is pure CSS (`peer-checked`) so it cannot drift. The ref
 * forwards to the underlying <input>, and it submits with native forms via `name`/`value`.
 *
 * `onCheckedChange(next)` is the primary, value-first API; the native `onChange(event)` is also
 * forwarded for consumers that need the raw event. `data-state="checked|unchecked"` is exposed on the
 * track as a convenience styling hook (matching the Accordion's `data-state` convention) so consumers
 * can target state without `peer-*` context; the actual checked *pixels* remain driven by `:checked`,
 * so the hook can never desync the visual.
 *
 * `className` is merged last with `twMerge` onto the TRACK, so a passed utility cleanly overrides the
 * built-in track utility from the same group (e.g. `bg-*`, `h-*`, `rounded-*`) instead of stacking.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    labelPosition = 'end',
    helperText,
    error,
    size = 'md',
    thumbContent,
    onCheckedChange,
    onChange,
    toggleOnEnter = false,
    id,
    className,
    disabled,
    required,
    checked,
    defaultChecked,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const dims = sizeClasses[size]

  // `data-state` is a convenience hook only; the checked *visual* is CSS (`peer-checked`), so this
  // best-effort mirror can never drift the pixels even if a render lags. In controlled mode it
  // follows the prop directly; in uncontrolled mode we track the last DOM change.
  const isControlled = checked !== undefined
  const [domChecked, setDomChecked] = useState<boolean>(Boolean(defaultChecked))
  const isChecked = isControlled ? Boolean(checked) : domChecked

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setDomChecked(event.target.checked)
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    // Spec: a checkbox toggles on Space (native, free) but NOT on Enter. Opt into Enter parity by
    // synthesising a click, which drives the native toggle + fires onChange exactly once.
    if (toggleOnEnter && event.key === 'Enter' && !disabled) {
      event.preventDefault()
      event.currentTarget.click()
    }
    props.onKeyDown?.(event)
  }

  // input (the real control, sr-only) + track/thumb sibling driven by `peer-*`.
  const control = (
    <span className="relative inline-flex items-center">
      <input
        {...props}
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        disabled={disabled}
        required={required}
        checked={checked}
        defaultChecked={defaultChecked}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="peer sr-only"
      />
      {/* Track and thumb are BOTH direct siblings of the input, so the `peer-checked` general-sibling
          selector reaches each of them. (A thumb nested inside the track would be a descendant, not a
          sibling, so peer-checked would never move it — the track recolours but the thumb stays put.) */}
      <span
        aria-hidden="true"
        data-state={isChecked ? 'checked' : 'unchecked'}
        className={twMerge(trackBase, dims.track, hasError && trackError, className)}
      />
      <span aria-hidden="true" className={twMerge(thumbBase, dims.thumb, dims.translate)}>
        {thumbContent}
      </span>
    </span>
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        // The <label> wraps the control, so clicking either the label text or the track toggles the
        // input. `htmlFor` keeps the association explicit for AT and for getByLabelText. The disabled
        // dim comes solely from `peer-disabled` on the track (not re-applied here) to avoid stacking.
        <label
          htmlFor={inputId}
          className={twMerge(
            'inline-flex w-fit select-none items-center gap-2.5 font-medium text-slate-700 dark:text-zinc-300',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            dims.text,
          )}
        >
          {labelPosition === 'start' ? (
            <>
              <span>
                {label}
                {required ? (
                  <span aria-hidden="true" className="ms-0.5 text-red-500">
                    *
                  </span>
                ) : null}
              </span>
              {control}
            </>
          ) : (
            <>
              {control}
              <span>
                {label}
                {required ? (
                  <span aria-hidden="true" className="ms-0.5 text-red-500">
                    *
                  </span>
                ) : null}
              </span>
            </>
          )}
        </label>
      ) : (
        control
      )}

      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-slate-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})
