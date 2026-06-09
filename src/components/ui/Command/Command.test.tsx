import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Command } from './Command'

function items(onNew = vi.fn(), onOpen = vi.fn()) {
  return [
    { value: 'new', label: 'New file', group: 'File', onSelect: onNew, keywords: ['create'] },
    { value: 'open', label: 'Open file', group: 'File', onSelect: onOpen },
    { value: 'settings', label: 'Settings', group: 'General' },
  ]
}

describe('Command', () => {
  it('renders all items grouped', () => {
    render(<Command items={items()} />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('filters by label and keywords', async () => {
    const user = userEvent.setup()
    render(<Command items={items()} />)
    await user.type(screen.getByRole('combobox'), 'create')
    // "New file" matches via the "create" keyword.
    expect(screen.getByRole('option', { name: /New file/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Settings/ })).toBeNull()
  })

  it('runs onSelect on click', async () => {
    const user = userEvent.setup()
    const onNew = vi.fn()
    render(<Command items={items(onNew)} />)
    await user.click(screen.getByRole('option', { name: /New file/ }))
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it('runs the active item on Enter', async () => {
    const user = userEvent.setup()
    const onNew = vi.fn()
    render(<Command items={items(onNew)} />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{Enter}')
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it('shows empty text when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Command items={items()} emptyText="Nothing" />)
    await user.type(screen.getByRole('combobox'), 'zzzzz')
    expect(screen.getByText('Nothing')).toBeInTheDocument()
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Command ref={ref} items={items()} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
