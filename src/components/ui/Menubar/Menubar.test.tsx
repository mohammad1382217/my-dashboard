import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menubar } from './Menubar'

function menus(onNew = vi.fn()) {
  return [
    { label: 'File', items: [{ label: 'New', onSelect: onNew }, { label: 'Open' }] },
    { label: 'Edit', items: [{ label: 'Undo' }, { label: 'Redo', disabled: true }] },
  ]
}

describe('Menubar', () => {
  it('renders a menubar of triggers', () => {
    render(<Menubar menus={menus()} />)
    expect(screen.getByRole('menubar')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'File' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
  })

  it('opens a menu on click', async () => {
    const user = userEvent.setup()
    render(<Menubar menus={menus()} />)
    await user.click(screen.getByRole('menuitem', { name: 'File' }))
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'New' })).toBeInTheDocument()
  })

  it('selects an item and closes', async () => {
    const user = userEvent.setup()
    const onNew = vi.fn()
    render(<Menubar menus={menus(onNew)} />)
    await user.click(screen.getByRole('menuitem', { name: 'File' }))
    await user.click(screen.getByRole('menuitem', { name: 'New' }))
    expect(onNew).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Menubar menus={menus()} />)
    await user.click(screen.getByRole('menuitem', { name: 'File' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })
})
