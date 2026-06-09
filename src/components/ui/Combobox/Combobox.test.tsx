import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from './Combobox'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'grape', label: 'Grape' },
]

describe('Combobox', () => {
  it('opens the listbox on focus', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} placeholder="Fruit" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('filters as you type', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} placeholder="Fruit" />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'ap')
    // "Apple" and "Grape" contain "ap"; "Banana" does not.
    expect(screen.getByRole('option', { name: /Apple/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Grape/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Banana/ })).toBeNull()
  })

  it('selects an option with the pointer', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox options={options} onChange={onChange} placeholder="Fruit" />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Banana/ }))
    expect(onChange).toHaveBeenCalledWith('banana')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    expect(screen.getByRole('combobox')).toHaveValue('Banana')
  })

  it('selects with keyboard (ArrowDown + Enter)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox options={options} onChange={onChange} placeholder="Fruit" />)
    await user.click(screen.getByRole('combobox'))
    // Focus opens the list with the first option (Apple) active; one step → Banana.
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('banana')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} placeholder="Fruit" />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Combobox ref={ref} options={options} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
