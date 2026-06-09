import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" />)
    // getByLabelText only resolves if htmlFor/id are wired correctly.
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement)
  })

  it('uses a provided id instead of the generated one', () => {
    render(<Input id="custom-id" label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'custom-id')
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(<Input label="Email" helperText="We never share it." />)
    const input = screen.getByLabelText('Email')
    const helper = screen.getByText('We never share it.')
    expect(input.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks the field invalid and hides the helper text', () => {
    render(<Input label="Email" helperText="We never share it." error="Invalid email." />)
    const input = screen.getByLabelText('Email')
    const error = screen.getByText('Invalid email.')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('We never share it.')).not.toBeInTheDocument()
  })

  it('supports a boolean error state without a message', () => {
    render(<Input label="Email" error />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is not marked invalid by default', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
  })

  it('forwards the ref to the underlying <input>', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} label="Email" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('spreads native input props', () => {
    render(<Input label="Email" type="email" placeholder="you@example.com" disabled />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'you@example.com')
    expect(input).toBeDisabled()
  })

  it('marks required and renders the required indicator', () => {
    render(<Input label="Email" required />)
    expect(screen.getByLabelText(/Email/)).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Input label="Email" size="lg" />)
    expect(screen.getByLabelText('Email').className).toContain('h-12')
  })

  it('renders adornments and pads the input for them', () => {
    render(<Input label="Search" startIcon={<span>🔍</span>} endIcon={<span>×</span>} />)
    const input = screen.getByLabelText('Search')
    // Logical padding (RTL-aware): start for the leading icon, end for the trailing one.
    expect(input.className).toContain('ps-9')
    expect(input.className).toContain('pe-9')
    expect(screen.getByText('🔍')).toBeInTheDocument()
    expect(screen.getByText('×')).toBeInTheDocument()
  })

  it('merges className overrides with twMerge (override wins, no conflict left)', () => {
    render(<Input label="Email" className="rounded-full border-emerald-400" />)
    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('rounded-full')
    expect(input.className).not.toContain('rounded-md')
    expect(input.className).toContain('border-emerald-400')
    expect(input.className).not.toContain('border-slate-300')
  })

  it('calls onChange and updates the value as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Name" onChange={onChange} />)
    const input = screen.getByLabelText<HTMLInputElement>('Name')

    await user.type(input, 'Jane')

    expect(onChange).toHaveBeenCalled()
    expect(input).toHaveValue('Jane')
  })
})
