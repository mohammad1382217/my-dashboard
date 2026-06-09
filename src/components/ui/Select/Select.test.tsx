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
  it('associates the label with the select', () => {
    render(<Select label="Fruit">{fruits()}</Select>)
    expect(screen.getByLabelText('Fruit')).toBeInstanceOf(HTMLSelectElement)
  })

  it('renders a disabled placeholder option plus the children', () => {
    render(
      <Select label="Fruit" placeholder="Pick one" defaultValue="">
        {fruits()}
      </Select>,
    )
    expect(screen.getByRole('option', { name: 'Pick one' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(
      <Select label="Fruit" helperText="Pick your favorite.">
        {fruits()}
      </Select>,
    )
    const field = screen.getByLabelText('Fruit')
    const helper = screen.getByText('Pick your favorite.')
    expect(field.getAttribute('aria-describedby')).toBe(helper.id)
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(
      <Select label="Fruit" helperText="Pick your favorite." error="Required.">
        {fruits()}
      </Select>,
    )
    const field = screen.getByLabelText('Fruit')
    const error = screen.getByText('Required.')

    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field.getAttribute('aria-describedby')).toContain(error.id)
    expect(screen.queryByText('Pick your favorite.')).not.toBeInTheDocument()
  })

  it('forwards the ref to the underlying <select>', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} label="Fruit">{fruits()}</Select>)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('updates the value and calls onChange when an option is chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Select label="Fruit" defaultValue="apple" onChange={onChange}>
        {fruits()}
      </Select>,
    )
    const field = screen.getByLabelText<HTMLSelectElement>('Fruit')

    await user.selectOptions(field, 'banana')

    expect(onChange).toHaveBeenCalled()
    expect(field).toHaveValue('banana')
  })

  it('applies size classes', () => {
    render(<Select label="Fruit" size="lg">{fruits()}</Select>)
    expect(screen.getByLabelText('Fruit').className).toContain('h-12')
  })

  it('merges className overrides with twMerge', () => {
    render(<Select label="Fruit" className="rounded-full">{fruits()}</Select>)
    const field = screen.getByLabelText('Fruit')
    expect(field.className).toContain('rounded-full')
    expect(field.className).not.toContain('rounded-md')
  })

  it('can be disabled', () => {
    render(<Select label="Fruit" disabled>{fruits()}</Select>)
    expect(screen.getByLabelText('Fruit')).toBeDisabled()
  })
})
