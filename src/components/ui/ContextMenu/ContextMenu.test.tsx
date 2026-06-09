import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenu } from './ContextMenu'

function makeItems(onCopy = vi.fn()) {
  return [
    { label: 'Copy', onSelect: onCopy },
    { label: 'Paste', disabled: true },
    { label: 'Delete', onSelect: vi.fn() },
  ]
}

describe('ContextMenu', () => {
  it('opens at the cursor on context menu', () => {
    render(
      <ContextMenu items={makeItems()}>
        <div>Right-click me</div>
      </ContextMenu>,
    )
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.contextMenu(screen.getByText('Right-click me'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('selects an item and closes', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(
      <ContextMenu items={makeItems(onCopy)}>
        <div>Right-click me</div>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Right-click me'))
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(onCopy).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu items={makeItems()}>
        <div>Right-click me</div>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Right-click me'))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })
})
