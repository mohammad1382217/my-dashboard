import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders its children as an accessible button', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInstanceOf(HTMLButtonElement)
  })

  it('defaults the type to "button"', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('allows overriding the type', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button.className).toContain('bg-red-600')
    expect(button.className).toContain('h-12')
  })

  it('forwards the ref to the underlying <button>', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('merges className overrides with twMerge', () => {
    render(<Button className="rounded-full">Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.className).toContain('rounded-full')
    expect(button.className).not.toContain('rounded-md')
  })

  it('spawns an aria-hidden ripple element on pointer down', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })

    expect(button.querySelector('.ripple')).toBeNull()

    fireEvent.pointerDown(button)

    const ripple = button.querySelector('.ripple')
    expect(ripple).not.toBeNull()
    expect(ripple).toHaveAttribute('aria-hidden', 'true')
  })
})
