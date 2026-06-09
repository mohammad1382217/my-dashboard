import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible } from './Collapsible'

describe('Collapsible', () => {
  it('is closed by default and toggles open', async () => {
    const user = userEvent.setup()
    render(
      <Collapsible trigger="Details">
        <p>Hidden body</p>
      </Collapsible>,
    )
    const trigger = screen.getByRole('button', { name: 'Details' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('region', { hidden: true })).not.toBeVisible()

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region')).toBeVisible()
  })

  it('respects defaultOpen', () => {
    render(
      <Collapsible trigger="Details" defaultOpen>
        <p>Body</p>
      </Collapsible>,
    )
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('fires onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Collapsible trigger="Details" onOpenChange={onOpenChange}>
        <p>Body</p>
      </Collapsible>,
    )
    await user.click(screen.getByRole('button', { name: 'Details' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Collapsible ref={ref} trigger="Details">
        <p>Body</p>
      </Collapsible>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
