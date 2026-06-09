import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from './Form'

describe('Form', () => {
  it('renders a native <form> with its children', () => {
    render(
      <Form aria-label="signup">
        <input aria-label="name" name="name" />
      </Form>,
    )
    const form = screen.getByRole('form', { name: 'signup' })
    expect(form.tagName).toBe('FORM')
    expect(screen.getByLabelText('name')).toBeInTheDocument()
  })

  it('forwards the ref to the underlying <form>', () => {
    const ref = createRef<HTMLFormElement>()
    render(<Form ref={ref} aria-label="f" />)
    expect(ref.current).toBeInstanceOf(HTMLFormElement)
  })

  it('submits the collected values from named controls (preventDefault handled)', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form aria-label="signup" onSubmit={onSubmit}>
        <input aria-label="email" name="email" defaultValue="a@b.com" />
        <input aria-label="plan" name="plan" defaultValue="pro" />
        <button type="submit">Submit</button>
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.com', plan: 'pro' })
    const event = onSubmit.mock.calls[0][1] as { defaultPrevented: boolean }
    expect(event.defaultPrevented).toBe(true)
  })

  it('reflects edits the user makes before submitting', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form aria-label="signup" onSubmit={onSubmit}>
        <input aria-label="name" name="name" />
        <button type="submit">Submit</button>
      </Form>,
    )

    await user.type(screen.getByLabelText('name'), 'Jane')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Jane' })
  })

  it('merges className overrides with twMerge', () => {
    render(<Form aria-label="f" className="gap-2" />)
    const form = screen.getByRole('form', { name: 'f' })
    expect(form.className).toContain('gap-2')
    expect(form.className).not.toContain('gap-5')
  })
})
