import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputOTP } from './InputOTP'

describe('InputOTP', () => {
  it('renders the requested number of slots (default 6)', () => {
    render(<InputOTP label="Code" />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('renders a custom length', () => {
    render(<InputOTP label="Code" length={4} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('fills a slot and advances focus as you type', async () => {
    const user = userEvent.setup()
    render(<InputOTP label="Code" />)
    const slots = screen.getAllByRole('textbox')

    await user.click(slots[0])
    await user.keyboard('1')

    expect(slots[0]).toHaveValue('1')
    expect(slots[1]).toHaveFocus()
  })

  it('calls onChange with the combined value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputOTP label="Code" onChange={onChange} />)

    await user.click(screen.getAllByRole('textbox')[0])
    await user.keyboard('123')

    expect(onChange).toHaveBeenLastCalledWith('123')
  })

  it('calls onComplete once every slot is filled', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<InputOTP label="Code" length={4} onComplete={onComplete} />)

    await user.click(screen.getAllByRole('textbox')[0])
    await user.keyboard('1234')

    expect(onComplete).toHaveBeenCalledWith('1234')
  })

  it('ignores non-digit characters', async () => {
    const user = userEvent.setup()
    render(<InputOTP label="Code" />)
    const slots = screen.getAllByRole('textbox')

    await user.click(slots[0])
    await user.keyboard('a')

    expect(slots[0]).toHaveValue('')
  })

  it('moves back and clears the previous slot on Backspace', async () => {
    const user = userEvent.setup()
    render(<InputOTP label="Code" />)
    const slots = screen.getAllByRole('textbox')

    await user.click(slots[0])
    await user.keyboard('12')
    // focus is now on the empty third slot; Backspace steps back into slot 2
    await user.keyboard('{Backspace}')

    expect(slots[1]).toHaveValue('')
    expect(slots[1]).toHaveFocus()
  })

  it('distributes a pasted code across the slots', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<InputOTP label="Code" length={6} onComplete={onComplete} />)
    const slots = screen.getAllByRole('textbox')

    await user.click(slots[0])
    await user.paste('123456')

    expect(onComplete).toHaveBeenCalledWith('123456')
    expect(slots[5]).toHaveValue('6')
  })

  it('forwards the ref to the first slot', () => {
    const ref = createRef<HTMLInputElement>()
    render(<InputOTP label="Code" ref={ref} />)
    expect(ref.current).toBe(screen.getAllByRole('textbox')[0])
  })

  it('exposes a hidden input carrying the value for native forms', async () => {
    const user = userEvent.setup()
    const { container } = render(<InputOTP label="Code" name="otp" />)

    await user.click(screen.getAllByRole('textbox')[0])
    await user.keyboard('12')

    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"][name="otp"]')
    expect(hidden?.value).toBe('12')
  })

  it('honours a controlled value', () => {
    render(<InputOTP label="Code" length={4} value="42" onChange={() => {}} />)
    const slots = screen.getAllByRole('textbox')
    expect(slots[0]).toHaveValue('4')
    expect(slots[1]).toHaveValue('2')
    expect(slots[2]).toHaveValue('')
  })

  it('shows the error, marks slots invalid and hides the helper text', () => {
    render(<InputOTP label="Code" helperText="6 digits." error="Invalid code." />)
    expect(screen.getByText('Invalid code.')).toBeInTheDocument()
    expect(screen.queryByText('6 digits.')).not.toBeInTheDocument()
    for (const slot of screen.getAllByRole('textbox')) {
      expect(slot).toHaveAttribute('aria-invalid', 'true')
    }
  })

  it('labels the group via aria-labelledby', () => {
    render(<InputOTP label="Verification code" />)
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument()
  })
})
