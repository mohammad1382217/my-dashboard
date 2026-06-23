import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

function fruits() {
  return (
    <>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </>
  )
}

describe('Select', () => {
  it('exposes the label on the combobox trigger', () => {
    render(<Select label="Fruit">{fruits()}</Select>)
    const trigger = screen.getByLabelText('Fruit')
    expect(trigger).toHaveAttribute('role', 'combobox')
    expect(trigger.tagName).toBe('BUTTON')
  })

  it('shows the placeholder on the trigger and the options once opened', async () => {
    const user = userEvent.setup()
    render(
      <Select label="Fruit" placeholder="Pick one" defaultValue="">
        {fruits()}
      </Select>,
    )
    const trigger = screen.getByLabelText('Fruit')
    expect(trigger).toHaveTextContent('Pick one')

    await user.click(trigger)
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(
      <Select label="Fruit" helperText="Pick your favorite.">
        {fruits()}
      </Select>,
    )
    const trigger = screen.getByLabelText('Fruit')
    const helper = screen.getByText('Pick your favorite.')
    expect(trigger.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(
      <Select label="Fruit" helperText="Pick your favorite." error="Required.">
        {fruits()}
      </Select>,
    )
    const trigger = screen.getByLabelText('Fruit')
    const error = screen.getByText('Required.')

    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('Pick your favorite.')).not.toBeInTheDocument()
  })

  it('forwards the ref to the underlying hidden <select>', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} label="Fruit">{fruits()}</Select>)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('updates the value and fires onChange (with event.target.value) when an option is picked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ref = createRef<HTMLSelectElement>()
    render(
      <Select ref={ref} label="Fruit" defaultValue="apple" onChange={onChange}>
        {fruits()}
      </Select>,
    )
    const trigger = screen.getByLabelText('Fruit')
    expect(trigger).toHaveTextContent('Apple')

    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Banana' }))

    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[0][0].target.value).toBe('banana')
    expect(ref.current).toHaveValue('banana')
    expect(trigger).toHaveTextContent('Banana')
  })

  it('opens and selects with the keyboard', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLSelectElement>()
    render(
      <Select ref={ref} label="Fruit" defaultValue="apple">
        {fruits()}
      </Select>,
    )
    const trigger = screen.getByLabelText('Fruit')
    trigger.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(ref.current).toHaveValue('banana')
    expect(trigger).toHaveTextContent('Banana')
  })

  it('applies size classes to the trigger', () => {
    render(<Select label="Fruit" size="lg">{fruits()}</Select>)
    expect(screen.getByLabelText('Fruit').className).toContain('h-12')
  })

  it('merges className overrides with twMerge on the trigger', () => {
    render(<Select label="Fruit" className="rounded-full">{fruits()}</Select>)
    const trigger = screen.getByLabelText('Fruit')
    expect(trigger.className).toContain('rounded-full')
    expect(trigger.className).not.toContain('rounded-md')
  })

  it('can be disabled', () => {
    render(<Select label="Fruit" disabled>{fruits()}</Select>)
    expect(screen.getByLabelText('Fruit')).toBeDisabled()
  })
})
