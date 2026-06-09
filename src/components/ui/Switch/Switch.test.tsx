import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

describe('Switch', () => {
  it('exposes the switch role on a real <input> and is off by default', () => {
    render(<Switch label="Wifi" />)
    const toggle = screen.getByRole('switch', { name: 'Wifi' })
    expect(toggle).toBeInstanceOf(HTMLInputElement)
    expect(toggle).not.toBeChecked()
  })

  it('associates the label with the underlying input', () => {
    render(<Switch label="Wifi" />)
    // getByLabelText only resolves if htmlFor/id are wired correctly.
    expect(screen.getByLabelText('Wifi')).toBeInstanceOf(HTMLInputElement)
  })

  it('does not leak the required asterisk into the accessible name', () => {
    render(<Switch label="Wifi" required />)
    // The asterisk is aria-hidden, so the accessible name stays exactly "Wifi".
    expect(screen.getByRole('switch', { name: 'Wifi' })).toBeInTheDocument()
  })

  it('toggles the switch when its label text is clicked', async () => {
    const user = userEvent.setup()
    render(<Switch label="Wifi" />)

    await user.click(screen.getByText('Wifi'))

    expect(screen.getByRole('switch', { name: 'Wifi' })).toBeChecked()
  })

  it('uses a provided id instead of the generated one', () => {
    render(<Switch id="custom-id" label="Wifi" />)
    expect(screen.getByLabelText('Wifi')).toHaveAttribute('id', 'custom-id')
  })

  it('honours defaultChecked (uncontrolled)', () => {
    render(<Switch label="Wifi" defaultChecked />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('toggles on click in uncontrolled mode', async () => {
    const user = userEvent.setup()
    render(<Switch label="Wifi" />)
    const toggle = screen.getByRole('switch', { name: 'Wifi' })

    await user.click(toggle)
    expect(toggle).toBeChecked()
    await user.click(toggle)
    expect(toggle).not.toBeChecked()
  })

  it('toggles with the Space key (native checkbox activation)', async () => {
    const user = userEvent.setup()
    render(<Switch label="Wifi" />)
    const toggle = screen.getByRole('switch', { name: 'Wifi' })

    toggle.focus()
    expect(toggle).toHaveFocus()
    await user.keyboard(' ')
    expect(toggle).toBeChecked()
  })

  it('does NOT toggle on Enter by default (spec-correct for a checkbox)', async () => {
    const user = userEvent.setup()
    render(<Switch label="Wifi" />)
    const toggle = screen.getByRole('switch', { name: 'Wifi' })

    toggle.focus()
    await user.keyboard('{Enter}')
    expect(toggle).not.toBeChecked()
  })

  it('toggles on Enter when toggleOnEnter is opted in', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch label="Wifi" toggleOnEnter onCheckedChange={onCheckedChange} />)
    const toggle = screen.getByRole('switch', { name: 'Wifi' })

    toggle.focus()
    await user.keyboard('{Enter}')
    expect(toggle).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange and onCheckedChange with the next state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onCheckedChange = vi.fn()
    render(<Switch label="Wifi" onChange={onChange} onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('switch'))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('respects a controlled checked prop (does not self-toggle)', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch label="Wifi" checked={false} onCheckedChange={onCheckedChange} />)
    const toggle = screen.getByRole('switch')

    await user.click(toggle)

    // Parent never updated the prop, so it stays off — but still reports the intended next value.
    expect(toggle).not.toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('reflects external state changes when fully controlled', async () => {
    const user = userEvent.setup()

    function Controlled() {
      const [on, setOn] = useState(false)
      // Pass setState straight through — onCheckedChange hands you the next boolean.
      return <Switch label="Wifi" checked={on} onCheckedChange={setOn} />
    }

    render(<Controlled />)
    const toggle = screen.getByRole('switch')

    expect(toggle).not.toBeChecked()
    await user.click(toggle)
    expect(toggle).toBeChecked()
    await user.click(toggle)
    expect(toggle).not.toBeChecked()
  })

  it('can be disabled and does not toggle', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch label="Wifi" disabled onCheckedChange={onCheckedChange} />)
    const toggle = screen.getByRole('switch')

    expect(toggle).toBeDisabled()
    await user.click(toggle)
    expect(toggle).not.toBeChecked()
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('marks required and renders the required indicator', () => {
    render(<Switch label="Accept" required />)
    expect(screen.getByRole('switch')).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(<Switch label="Wifi" helperText="Stay connected." />)
    const toggle = screen.getByRole('switch')
    const helper = screen.getByText('Stay connected.')
    expect(toggle.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(<Switch label="Wifi" helperText="Stay connected." error="Required." />)
    const toggle = screen.getByRole('switch')
    const error = screen.getByText('Required.')

    expect(toggle).toHaveAttribute('aria-invalid', 'true')
    expect(toggle.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('Stay connected.')).not.toBeInTheDocument()
  })

  it('supports a boolean error state without a message', () => {
    render(<Switch label="Wifi" error />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is not marked invalid by default', () => {
    render(<Switch label="Wifi" />)
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid')
  })

  it('forwards the ref to the underlying <input>', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Switch ref={ref} label="Wifi" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.type).toBe('checkbox')
    expect(ref.current?.getAttribute('role')).toBe('switch')
  })

  it('spreads native props (name/value) so it serializes in a form', () => {
    render(<Switch label="Wifi" name="wifi" value="enabled" defaultChecked />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('name', 'wifi')
    expect(toggle).toHaveAttribute('value', 'enabled')
    // It is a real checkbox in the DOM, so a native <form> picks it up directly.
    expect(toggle).toBeChecked()
  })

  it('exposes a data-state styling hook on the track and updates it on toggle', async () => {
    const user = userEvent.setup()
    const { container } = render(<Switch label="Wifi" />)
    const track = container.querySelector('[aria-hidden="true"]')

    expect(track).toHaveAttribute('data-state', 'unchecked')
    await user.click(screen.getByRole('switch'))
    expect(track).toHaveAttribute('data-state', 'checked')
  })

  it('reflects data-state from a controlled checked prop', () => {
    const { container } = render(<Switch label="Wifi" checked readOnly />)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveAttribute('data-state', 'checked')
  })

  it('renders thumbContent inside the thumb', () => {
    render(<Switch label="Wifi" thumbContent={<span data-testid="glyph">✓</span>} />)
    expect(screen.getByTestId('glyph')).toBeInTheDocument()
  })

  it('renders the sliding thumb as a sibling of the input (so peer-checked can move it)', () => {
    const { container } = render(<Switch label="Wifi" />)
    const input = screen.getByRole('switch')
    // The thumb is the decorative element carrying the translateX transform.
    const thumb = container.querySelector('[class*="translateX"]')
    expect(thumb).not.toBeNull()
    // Regression guard: the thumb must share the input's parent. If it were nested inside the
    // track instead, the `peer-checked ~` general-sibling selector could never reach it, so the
    // thumb would never slide — only the track would recolour.
    expect(thumb?.parentElement).toBe(input.parentElement)
  })

  it('renders the label before the track when labelPosition="start"', () => {
    const { container } = render(<Switch label="Wifi" labelPosition="start" />)
    const label = container.querySelector('label')
    const text = screen.getByText('Wifi')
    const control = container.querySelector('[aria-hidden="true"]')
    // In document order the label text precedes the visual track.
    expect(
      text.compareDocumentPosition(control as Node) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    // Still toggles when the label text is clicked, regardless of position.
    expect(label).toBeInTheDocument()
  })

  it('applies size classes to the visual track', () => {
    const { container } = render(<Switch label="Wifi" size="lg" />)
    // The track is the aria-hidden sibling of the sr-only input.
    const track = container.querySelector('[aria-hidden="true"]')
    expect(track?.className).toContain('w-11')
  })

  it('merges className overrides onto the track with twMerge (override wins)', () => {
    const { container } = render(<Switch label="Wifi" className="bg-emerald-500" />)
    const track = container.querySelector('[aria-hidden="true"]')
    expect(track?.className).toContain('bg-emerald-500')
    expect(track?.className).not.toContain('bg-slate-300')
  })
})
