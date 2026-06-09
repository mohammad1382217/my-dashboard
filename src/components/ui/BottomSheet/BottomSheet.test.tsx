import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from './BottomSheet'

describe('BottomSheet', () => {
  it('renders nothing when closed', () => {
    render(
      <BottomSheet open={false} onOpenChange={() => {}} title="Filters">
        Body
      </BottomSheet>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders an accessible modal sheet when open', () => {
    render(
      <BottomSheet open onOpenChange={() => {}} title="Filters" description="Refine results">
        Body
      </BottomSheet>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('Filters').id)
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('Refine results').id)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('moves focus into the sheet on open and locks scroll', () => {
    const { rerender } = render(
      <BottomSheet open onOpenChange={() => {}} title="Filters">
        Body
      </BottomSheet>,
    )
    expect(screen.getByRole('dialog')).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    rerender(
      <BottomSheet open={false} onOpenChange={() => {}} title="Filters">
        Body
      </BottomSheet>,
    )
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <BottomSheet open onOpenChange={onOpenChange} title="Filters">
        Body
      </BottomSheet>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes on overlay click (and not when disabled)', () => {
    const onOpenChange = vi.fn()
    const { baseElement, rerender } = render(
      <BottomSheet open onOpenChange={onOpenChange} title="Filters">
        Body
      </BottomSheet>,
    )
    fireEvent.click(baseElement.querySelector('[class*="bg-black"]') as HTMLElement)
    expect(onOpenChange).toHaveBeenCalledWith(false)

    onOpenChange.mockClear()
    rerender(
      <BottomSheet open onOpenChange={onOpenChange} closeOnOverlayClick={false} title="Filters">
        Body
      </BottomSheet>,
    )
    fireEvent.click(baseElement.querySelector('[class*="bg-black"]') as HTMLElement)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <BottomSheet open onOpenChange={onOpenChange} title="Filters" closeLabel="Close">
        Body
      </BottomSheet>,
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('forwards the ref to the panel', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <BottomSheet open onOpenChange={() => {}} ref={ref} title="Filters">
        Body
      </BottomSheet>,
    )
    expect(ref.current).toBe(screen.getByRole('dialog'))
  })
})
