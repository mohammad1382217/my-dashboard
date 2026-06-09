import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenu } from './DropdownMenu'

function makeItems(onEdit = vi.fn(), onDelete = vi.fn()) {
  return [
    { label: 'Edit', onSelect: onEdit },
    { label: 'Duplicate', disabled: true },
    { label: 'Delete', onSelect: onDelete },
  ]
}

describe('DropdownMenu', () => {
  it('opens the menu on trigger click', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu label="Options" items={makeItems()} />)

    expect(screen.queryByRole('menu')).toBeNull()
    await user.click(screen.getByRole('button', { name: /Options/ }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('selects an item and closes', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<DropdownMenu label="Options" items={makeItems(onEdit)} />)

    await user.click(screen.getByRole('button', { name: /Options/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }))

    expect(onEdit).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('disables a disabled item', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu label="Options" items={makeItems()} />)
    await user.click(screen.getByRole('button', { name: /Options/ }))
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeDisabled()
  })

  it('opens with ArrowDown and moves the roving focus past disabled items', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu label="Options" items={makeItems()} />)
    const trigger = screen.getByRole('button', { name: /Options/ })

    trigger.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    // skips the disabled "Duplicate"
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
  })

  it('selects the active item with Enter', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<DropdownMenu label="Options" items={makeItems(onEdit)} />)
    const trigger = screen.getByRole('button', { name: /Options/ })

    trigger.focus()
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu label="Options" items={makeItems()} />)
    await user.click(screen.getByRole('button', { name: /Options/ }))

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('forwards the ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<DropdownMenu label="Options" items={makeItems()} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
