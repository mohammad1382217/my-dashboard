import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup } from './ToggleGroup'

const items = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right', disabled: true },
]

describe('ToggleGroup', () => {
  it('selects a single value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ToggleGroup items={items} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenCalledWith('center')
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('deselects on second click in single mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ToggleGroup items={items} defaultValue="left" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Left' }))
    expect(onValueChange).toHaveBeenCalledWith(null)
  })

  it('accumulates values in multiple mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ToggleGroup type="multiple" items={items} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Left' }))
    await user.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['left', 'center'])
  })

  it('disables a disabled item', () => {
    render(<ToggleGroup items={items} />)
    expect(screen.getByRole('button', { name: 'Right' })).toBeDisabled()
  })

  it('exposes a group role', () => {
    render(<ToggleGroup items={items} />)
    expect(screen.getByRole('group')).toBeInTheDocument()
  })
})
