import { forwardRef, useId, useState } from 'react'
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

/* -------------------------------------------------------------------------------------------------
 * Why this leans on native <input type="radio">
 * -------------------------------------------------------------------------------------------------
 * Radios that share one `name` are a real radio group in every engine we target, so the browser
 * gives us — for free — arrow-key roving focus, single-selection exclusivity, the implicit
 * radiogroup/radio ARIA roles, and native form submission. We only layer on a controlled/
 * uncontrolled value model, a labelled <fieldset> wrapper, the error/helper a11y wiring, and a
 * styled visual control (animated with transform/opacity only, which downlevels to old Chrome).
 * -----------------------------------------------------------------------------------------------*/

type RadioSize = 'sm' | 'md' | 'lg'
type RadioOrientation = 'vertical' | 'horizontal'

export interface RadioOption {
  /** The submitted/selected value. Must be unique within the group. */
  value: string
  /** Visible label beside the control. */
  label?: ReactNode
  /** Secondary text under the label, linked via aria-describedby. */
  description?: ReactNode
  /** Disable just this option. */
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange' | 'defaultValue'> {
  /** The options to choose from. */
  options: RadioOption[]
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string
  /** Uncontrolled initial selected value. */
  defaultValue?: string
  /** Fires with the next selected value when the user picks an option. */
  onValueChange?: (value: string) => void
  /** Shared radio `name`. Auto-generated (and stable) when omitted. */
  name?: string
  /** Visible group label rendered in the <legend>. */
  label?: ReactNode
  /** Hint shown below the group. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Size of the radios + text. Defaults to "md". */
  size?: RadioSize
  /** Lay options out in a column ("vertical", default) or a row ("horizontal"). */
  orientation?: RadioOrientation
  /** Disable every option. */
  disabled?: boolean
  /** Mark the group required (red asterisk + native `required` on each radio). */
  required?: boolean
}

const orientationClasses: Record<RadioOrientation, string> = {
  vertical: 'flex-col gap-2.5',
  horizontal: 'flex-row flex-wrap gap-x-6 gap-y-2.5',
}

const controlSizeClasses: Record<RadioSize, string> = {
  sm: 'size-4',
  md: 'size-[1.125rem]',
  lg: 'size-5',
}

const dotSizeClasses: Record<RadioSize, string> = {
  sm: 'after:size-1.5',
  md: 'after:size-2',
  lg: 'after:size-2.5',
}

const labelTextSizeClasses: Record<RadioSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
}

// The visual control. The real <input> sits beneath it (transparent + absolute) so all focus +
// selection stays native; we mirror its state with peer-* utilities. Only transform/opacity
// transitions are used so the dot + ring animate on old Chrome/Android.
const controlBase =
  'pointer-events-none relative flex shrink-0 items-center justify-center rounded-full border bg-white transition-colors dark:bg-zinc-900 ' +
  "after:rounded-full after:bg-white after:transition-transform after:duration-150 after:ease-out after:content-[''] after:scale-0 peer-checked:after:scale-100 " +
  'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-disabled:opacity-60'

/**
 * Accessible group of mutually-exclusive options, driven by an `options` array.
 * Built on native <input type="radio"> sharing one `name`, so arrow-key roving
 * focus, single-selection and form submission come from the browser. Renders a
 * <fieldset>/<legend>, wires aria-invalid / aria-describedby at the group level,
 * and supports controlled (`value` + `onValueChange`) and uncontrolled
 * (`defaultValue`) usage. `className` is merged last with `twMerge`.
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    name,
    label,
    helperText,
    error,
    size = 'md',
    orientation = 'vertical',
    disabled = false,
    required = false,
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const generatedName = useId()
  // A separate, always-instance-unique base for per-option ids. Deriving option ids from this
  // (rather than from the consumer-controllable `groupId`) keeps two groups that were handed the
  // SAME explicit `id` prop from minting colliding option ids — and the `htmlFor` targets that go
  // with them — so getByLabelText / screen readers always resolve unambiguously.
  const optionBaseId = useId()
  const groupId = id ?? autoId
  // A shared, stable name makes the native radios exclusive; the generated fallback keeps two
  // groups on the same page from colliding.
  const groupName = name ?? generatedName
  const helperId = `${groupId}-helper`
  const errorId = `${groupId}-error`
  const legendId = `${groupId}-legend`

  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const value = isControlled ? valueProp : internalValue

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') ||
    undefined

  const controlState = hasError
    ? 'border-red-500 peer-checked:border-red-600 peer-checked:bg-red-600 peer-focus-visible:ring-red-500/40'
    : 'border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-focus-visible:ring-indigo-500/40 dark:border-zinc-600'

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <fieldset
      ref={ref}
      id={groupId}
      role="radiogroup"
      aria-labelledby={label ? legendId : undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      disabled={disabled}
      className={twMerge('flex min-w-0 flex-col gap-2 border-0 p-0', className)}
      {...rest}
    >
      {label ? (
        <legend id={legendId} className="mb-1 p-0 text-sm font-medium text-slate-700 dark:text-zinc-300">
          {label}
          {required ? <span className="ms-0.5 text-red-500">*</span> : null}
        </legend>
      ) : null}

      <div className={twMerge('flex', orientationClasses[orientation])}>
        {options.map((option, index) => {
          // Index-based + instance-unique base: duplicate option `value`s can't collide ids
          // (index disambiguates), and two groups sharing an explicit `id` can't either
          // (optionBaseId is per-instance).
          const optionId = `${optionBaseId}-${index}`
          const descriptionId = `${optionId}-description`
          const optionDisabled = disabled || Boolean(option.disabled)
          const cursorClass = optionDisabled ? 'cursor-not-allowed' : 'cursor-pointer'

          return (
            <div
              key={option.value}
              className={twMerge('flex min-w-0 items-start gap-2.5', optionDisabled ? 'opacity-60' : null)}
            >
              <label htmlFor={optionId} className={twMerge('relative flex items-center', cursorClass)}>
                <input
                  id={optionId}
                  type="radio"
                  name={groupName}
                  value={option.value}
                  checked={value === option.value}
                  disabled={optionDisabled}
                  required={required}
                  aria-describedby={option.description ? descriptionId : undefined}
                  onChange={handleChange}
                  // Real control: stacked over the visual one, transparent, but focusable and
                  // clickable so native a11y/selection is untouched.
                  className={twMerge('peer absolute inset-0 size-full opacity-0', cursorClass)}
                />
                <span
                  aria-hidden="true"
                  className={twMerge(controlBase, controlSizeClasses[size], dotSizeClasses[size], controlState)}
                />
              </label>

              {option.label || option.description ? (
                <span className="flex min-w-0 flex-col gap-0.5">
                  {option.label ? (
                    <label
                      htmlFor={optionId}
                      className={twMerge('leading-tight font-medium text-slate-900 dark:text-zinc-100', cursorClass, labelTextSizeClasses[size])}
                    >
                      {option.label}
                    </label>
                  ) : null}
                  {option.description ? (
                    <span id={descriptionId} className="text-sm text-slate-500 dark:text-zinc-400">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>

      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-slate-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </fieldset>
  )
})
