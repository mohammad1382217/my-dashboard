import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(
      <Dialog open={false} onOpenChange={() => {}} title="Title">
        Body
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders an accessible modal with title and description when open', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Delete item" description="This cannot be undone.">
        Body
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('Delete item').id)
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('This cannot be undone.').id)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('moves focus into the dialog on open', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="T">
        Body
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('locks body scroll while open', () => {
    const { rerender } = render(
      <Dialog open onOpenChange={() => {}} title="T">
        Body
      </Dialog>,
    )
    expect(document.body.style.overflow).toBe('hidden')
    rerender(
      <Dialog open={false} onOpenChange={() => {}} title="T">
        Body
      </Dialog>,
    )
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange} title="T">
        Body
      </Dialog>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange} closeOnEscape={false} title="T">
        Body
      </Dialog>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes when the overlay is clicked', () => {
    const onOpenChange = vi.fn()
    const { baseElement } = render(
      <Dialog open onOpenChange={onOpenChange} title="T">
        Body
      </Dialog>,
    )
    const overlay = baseElement.querySelector('[class*="bg-black"]') as HTMLElement
    fireEvent.click(overlay)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not close on overlay click when disabled', () => {
    const onOpenChange = vi.fn()
    const { baseElement } = render(
      <Dialog open onOpenChange={onOpenChange} closeOnOverlayClick={false} title="T">
        Body
      </Dialog>,
    )
    const overlay = baseElement.querySelector('[class*="bg-black"]') as HTMLElement
    fireEvent.click(overlay)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange} title="T" closeLabel="Close">
        Body
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders footer actions', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="T" footer={<button type="button">Confirm</button>}>
        Body
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('forwards the ref to the dialog panel', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Dialog open onOpenChange={() => {}} ref={ref} title="T">
        Body
      </Dialog>,
    )
    expect(ref.current).toBe(screen.getByRole('dialog'))
  })
})
