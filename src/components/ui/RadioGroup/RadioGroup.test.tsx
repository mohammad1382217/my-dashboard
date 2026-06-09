import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from './RadioGroup'
import type { RadioGroupProps, RadioOption } from './RadioGroup'

const PLAN_OPTIONS: RadioOption[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

function Plans(props: Partial<RadioGroupProps>) {
  return <RadioGroup label="Plan" options={PLAN_OPTIONS} {...props} />
}

describe('RadioGroup', () => {
  it('exposes a radiogroup labelled by its legend', () => {
    render(<Plans />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInstanceOf(HTMLFieldSetElement)
  })

  it('renders one accessible radio per option, grouped by a shared name', () => {
    render(<Plans />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    const names = new Set(radios.map((r) => r.getAttribute('name')))
    expect(names.size).toBe(1)
    expect(screen.getByLabelText('Free')).toBe(radios[0])
  })

  it('honours an uncontrolled defaultValue', () => {
    render(<Plans defaultValue="pro" />)
    expect(screen.getByLabelText<HTMLInputElement>('Pro')).toBeChecked()
    expect(screen.getByLabelText<HTMLInputElement>('Free')).not.toBeChecked()
  })

  it('selects an option and fires onValueChange (uncontrolled)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Plans onValueChange={onValueChange} />)

    await user.click(screen.getByLabelText('Pro'))

    expect(onValueChange).toHaveBeenCalledWith('pro')
    expect(screen.getByLabelText<HTMLInputElement>('Pro')).toBeChecked()
  })

  it('respects the controlled value and reflects external updates', async () => {
    const user = userEvent.setup()

    function Controlled() {
      const [value, setValue] = useState('free')
      return <Plans value={value} onValueChange={setValue} />
    }

    render(<Controlled />)
    expect(screen.getByLabelText<HTMLInputElement>('Free')).toBeChecked()

    await user.click(screen.getByLabelText('Team'))

    expect(screen.getByLabelText<HTMLInputElement>('Team')).toBeChecked()
    expect(screen.getByLabelText<HTMLInputElement>('Free')).not.toBeChecked()
  })

  it('does not change a controlled value when no handler is wired', async () => {
    const user = userEvent.setup()
    render(<Plans value="free" />)

    await user.click(screen.getByLabelText('Pro'))

    expect(screen.getByLabelText<HTMLInputElement>('Free')).toBeChecked()
    expect(screen.getByLabelText<HTMLInputElement>('Pro')).not.toBeChecked()
  })

  it('disables the whole group', () => {
    render(<Plans disabled />)
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
  })

  it('disables a single option only', () => {
    render(
      <RadioGroup
        label="Plan"
        options={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro', disabled: true },
        ]}
      />,
    )
    expect(screen.getByLabelText('Free')).toBeEnabled()
    expect(screen.getByLabelText('Pro')).toBeDisabled()
  })

  it('renders helper text and links it via aria-describedby on the group', () => {
    render(<Plans helperText="Pick a tier." />)
    const group = screen.getByRole('radiogroup', { name: 'Plan' })
    const helper = screen.getByText('Pick a tier.')
    expect(group.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks the group invalid and hides the helper text', () => {
    render(<Plans helperText="Pick a tier." error="Required." />)
    const group = screen.getByRole('radiogroup', { name: 'Plan' })
    const error = screen.getByText('Required.')

    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('Pick a tier.')).not.toBeInTheDocument()
  })

  it('supports a boolean error state without a message', () => {
    render(<Plans error />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('is not marked invalid by default', () => {
    render(<Plans />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).not.toHaveAttribute('aria-invalid')
  })

  it('marks the group required and renders the indicator', () => {
    render(<Plans required />)
    expect(screen.getByRole('radiogroup', { name: /Plan/ })).toHaveAttribute('aria-required', 'true')
    expect(screen.getByText('*')).toBeInTheDocument()
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeRequired()
    }
  })

  it('links a per-option description via aria-describedby', () => {
    render(
      <RadioGroup
        label="Plan"
        options={[{ value: 'free', label: 'Free', description: 'For hobby projects.' }]}
      />,
    )
    const radio = screen.getByLabelText('Free')
    const desc = screen.getByText('For hobby projects.')
    expect(radio.getAttribute('aria-describedby')).toBe(desc.id)
  })

  it('uses a provided name for every radio', () => {
    render(<Plans name="billing-plan" />)
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('name', 'billing-plan')
    }
  })

  it('auto-generates a single shared name per group, distinct across groups', () => {
    render(
      <>
        <RadioGroup
          label="A"
          options={[
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y' },
          ]}
        />
        <RadioGroup label="B" options={[{ value: 'x', label: 'X2' }]} />
      </>,
    )
    const a = screen.getByLabelText('X').getAttribute('name')
    const y = screen.getByLabelText('Y').getAttribute('name')
    const b = screen.getByLabelText('X2').getAttribute('name')
    expect(a).toBe(y)
    expect(a).not.toBe(b)
  })

  it('forwards the ref to the underlying <fieldset>', () => {
    const ref = createRef<HTMLFieldSetElement>()
    render(<RadioGroup ref={ref} label="Plan" options={[{ value: 'free', label: 'Free' }]} />)
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
  })

  it('merges className overrides with twMerge', () => {
    render(<Plans className="gap-8" />)
    const group = screen.getByRole('radiogroup', { name: 'Plan' })
    expect(group.className).toContain('gap-8')
    expect(group.className).not.toContain('gap-2')
  })

  it('moves selection with the arrow keys (native roving focus)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Plans defaultValue="free" onValueChange={onValueChange} />)

    screen.getByLabelText<HTMLInputElement>('Free').focus()
    await user.keyboard('{ArrowDown}')

    expect(screen.getByLabelText<HTMLInputElement>('Pro')).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('pro')
  })

  it('keeps the per-option name out of the accessible name (label only)', () => {
    render(
      <RadioGroup
        label="Plan"
        options={[{ value: 'free', label: 'Free', description: 'For hobby projects.' }]}
      />,
    )
    // The radio's accessible name is exactly the label, NOT "Free For hobby projects."
    expect(screen.getByLabelText('Free')).toHaveAccessibleName('Free')
  })

  it('preserves an uncontrolled selection across unrelated parent re-renders', async () => {
    const user = userEvent.setup()

    function Host() {
      const [, setTick] = useState(0)
      return (
        <>
          <button type="button" onClick={() => setTick((n) => n + 1)}>
            rerender
          </button>
          <Plans />
        </>
      )
    }

    render(<Host />)
    await user.click(screen.getByLabelText('Pro'))
    expect(screen.getByLabelText<HTMLInputElement>('Pro')).toBeChecked()

    // The internal state mirror must survive an unrelated parent re-render.
    await user.click(screen.getByRole('button', { name: 'rerender' }))
    expect(screen.getByLabelText<HTMLInputElement>('Pro')).toBeChecked()
  })

  it('gives duplicate-value options distinct DOM ids (no id collision)', () => {
    // Misuse guard: even if two options share a value within one group, the
    // index-based id keeps their ids — and their <label htmlFor> targets —
    // distinct, so getByLabelText resolves unambiguously.
    render(
      <RadioGroup
        label="Plan"
        options={[
          { value: 'dup', label: 'First' },
          { value: 'dup', label: 'Second' },
        ]}
      />,
    )
    const first = screen.getByLabelText('First')
    const second = screen.getByLabelText('Second')
    expect(first.id).not.toBe('')
    expect(first.id).not.toBe(second.id)
  })

  it('keeps option ids distinct across two groups sharing an explicit id', () => {
    // Passing the same `id` to two groups must not collide their option ids,
    // because each instance derives option ids from its own useId() base.
    render(
      <>
        <RadioGroup id="dupgroup" label="One" options={[{ value: 'free', label: 'Free A' }]} />
        <RadioGroup id="dupgroup" label="Two" options={[{ value: 'free', label: 'Free B' }]} />
      </>,
    )
    expect(screen.getByLabelText('Free A').id).not.toBe(screen.getByLabelText('Free B').id)
  })
})
