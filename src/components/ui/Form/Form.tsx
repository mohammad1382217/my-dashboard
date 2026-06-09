import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, FormEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface FormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  /**
   * Fires on submit with the form's values, collected from the native FormData
   * of its named controls — `event.preventDefault()` is already called for you.
   * Omit it to fall back to a plain native submit.
   */
  onSubmit?: (values: Record<string, string>, event: FormEvent<HTMLFormElement>) => void
}

/**
 * Native <form> wrapper that stacks its fields with consistent spacing and hands
 * you the submitted values (from the browser's FormData) without the usual
 * preventDefault + FormData boilerplate. Forwards the ref to the <form>;
 * `className` is merged last with `twMerge`.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { onSubmit, className, children, ...props },
  ref,
) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onSubmit) return
    event.preventDefault()
    const values: Record<string, string> = {}
    new FormData(event.currentTarget).forEach((value, key) => {
      values[key] = typeof value === 'string' ? value : value.name
    })
    onSubmit(values, event)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className={twMerge('flex flex-col gap-5', className)} {...props}>
      {children}
    </form>
  )
})
