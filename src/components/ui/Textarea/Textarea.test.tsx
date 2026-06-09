import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('associates the label with the textarea', () => {
    render(<Textarea label="Bio" />)
    expect(screen.getByLabelText('Bio')).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(<Textarea label="Bio" helperText="Tell us about you." />)
    const field = screen.getByLabelText('Bio')
    const helper = screen.getByText('Tell us about you.')
    expect(field.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(<Textarea label="Bio" helperText="Tell us about you." error="Required." />)
    const field = screen.getByLabelText('Bio')
    const error = screen.getByText('Required.')

    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('Tell us about you.')).not.toBeInTheDocument()
  })

  it('is not marked invalid by default', () => {
    render(<Textarea label="Bio" />)
    expect(screen.getByLabelText('Bio')).not.toHaveAttribute('aria-invalid')
  })

  it('forwards the ref to the underlying <textarea>', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} label="Bio" />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('spreads native textarea props', () => {
    render(<Textarea label="Bio" rows={6} placeholder="Write…" disabled />)
    const field = screen.getByLabelText('Bio')
    expect(field).toHaveAttribute('rows', '6')
    expect(field).toHaveAttribute('placeholder', 'Write…')
    expect(field).toBeDisabled()
  })

  it('marks required and renders the required indicator', () => {
    render(<Textarea label="Bio" required />)
    expect(screen.getByLabelText(/Bio/)).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Textarea label="Bio" size="lg" />)
    expect(screen.getByLabelText('Bio').className).toContain('min-h-28')
  })

  it('merges className overrides with twMerge', () => {
    render(<Textarea label="Bio" className="rounded-full" />)
    const field = screen.getByLabelText('Bio')
    expect(field.className).toContain('rounded-full')
    expect(field.className).not.toContain('rounded-md')
  })

  it('calls onChange and updates the value as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Bio" onChange={onChange} />)
    const field = screen.getByLabelText<HTMLTextAreaElement>('Bio')

    await user.type(field, 'Hi')

    expect(onChange).toHaveBeenCalled()
    expect(field).toHaveValue('Hi')
  })
})
