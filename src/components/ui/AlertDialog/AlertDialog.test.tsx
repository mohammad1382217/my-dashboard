import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from './AlertDialog'

function Harness(props: { onConfirm?: () => void; onCancel?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete project?"
        description="This cannot be undone."
        confirmText="Delete"
        destructive
        onConfirm={props.onConfirm}
        onCancel={props.onCancel}
      />
    </>
  )
}

describe('AlertDialog', () => {
  it('exposes the alertdialog role with a description', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
  })

  it('focuses the Cancel button on open', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('confirms and closes', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Delete' })) // the confirm button inside the dialog
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  })

  it('cancels on Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<Harness onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  })
})
