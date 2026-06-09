import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/library' },
  { label: 'Data' },
]

describe('Breadcrumb', () => {
  it('renders a labelled nav landmark', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders intermediate items as links', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
  })

  it('marks the last item as the current page and not a link', () => {
    render(<Breadcrumb items={items} />)
    const current = screen.getByText('Data')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Data' })).toBeNull()
  })

  it('uses a custom nav label', () => {
    render(<Breadcrumb items={items} label="مسیر" />)
    expect(screen.getByRole('navigation', { name: 'مسیر' })).toBeInTheDocument()
  })
})
