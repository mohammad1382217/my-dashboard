import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavigationMenu } from './NavigationMenu'

const items = [
  {
    label: 'Products',
    content: [
      { label: 'Analytics', href: '/a', description: 'Track metrics' },
      { label: 'Billing', href: '/b' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
]

describe('NavigationMenu', () => {
  it('renders a labelled nav with triggers and plain links', () => {
    render(<NavigationMenu items={items} />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Products/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing')
  })

  it('opens a panel with links on click', async () => {
    const user = userEvent.setup()
    render(<NavigationMenu items={items} />)
    await user.click(screen.getByRole('button', { name: /Products/ }))
    expect(screen.getByRole('link', { name: /Analytics/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Billing/ })).toBeInTheDocument()
  })

  it('marks the trigger expanded while open', async () => {
    const user = userEvent.setup()
    render(<NavigationMenu items={items} />)
    const trigger = screen.getByRole('button', { name: /Products/ })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the panel on Escape', async () => {
    const user = userEvent.setup()
    render(<NavigationMenu items={items} />)
    await user.click(screen.getByRole('button', { name: /Products/ }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('link', { name: /Analytics/ })).toBeNull())
  })
})
