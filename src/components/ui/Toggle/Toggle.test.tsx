import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('toggles aria-pressed when uncontrolled', async () => {
    const user = userEvent.setup()
    render(<Toggle>Bold</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('respects defaultPressed', () => {
    render(<Toggle defaultPressed>Bold</Toggle>)
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('fires onPressedChange', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>)
    await user.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('stays controlled by the pressed prop', async () => {
    const user = userEvent.setup()
    render(<Toggle pressed={false}>Bold</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Toggle ref={ref}>Bold</Toggle>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
