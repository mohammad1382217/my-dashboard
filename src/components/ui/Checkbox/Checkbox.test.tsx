import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders a labelled checkbox', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInstanceOf(HTMLInputElement)
  })

  it('toggles when the label is clicked', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Accept" />)

    await user.click(screen.getByText('Accept'))

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange and onCheckedChange with the next state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Accept" onChange={onChange} onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('honours defaultChecked (uncontrolled)', () => {
    render(<Checkbox label="x" defaultChecked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('respects a controlled checked prop', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="x" checked={false} onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('reflects the indeterminate state on the DOM node', () => {
    render(<Checkbox label="x" indeterminate />)
    expect(screen.getByRole('checkbox')).toHaveProperty('indeterminate', true)
  })

  it('can be disabled and does not toggle', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="x" disabled onCheckedChange={onCheckedChange} />)
    const box = screen.getByRole('checkbox')

    expect(box).toBeDisabled()
    await user.click(box)
    expect(box).not.toBeChecked()
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('marks required and renders the indicator', () => {
    render(<Checkbox label="Accept" required />)
    expect(screen.getByRole('checkbox')).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(<Checkbox label="x" helperText="Optional." />)
    const box = screen.getByRole('checkbox')
    const helper = screen.getByText('Optional.')
    expect(box.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(<Checkbox label="x" helperText="Optional." error="Required." />)
    const box = screen.getByRole('checkbox')
    const errorNode = screen.getByText('Required.')

    expect(box).toHaveAttribute('aria-invalid', 'true')
    expect(box.getAttribute('aria-describedby')).toContain(errorNode.id)
    expect(screen.queryByText('Optional.')).not.toBeInTheDocument()
  })

  it('forwards the ref to the underlying <input>', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.type).toBe('checkbox')
  })

  it('merges className onto the control with twMerge', () => {
    render(<Checkbox label="x" className="size-6" />)
    const control = screen.getByRole('checkbox').parentElement as HTMLElement
    expect(control.className).toContain('size-6')
    expect(control.className).not.toContain('size-5')
  })
})
