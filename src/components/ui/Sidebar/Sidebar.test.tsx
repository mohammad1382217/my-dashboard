import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './Sidebar'

const sections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '#', active: true, icon: <span>D</span> },
      { label: 'Projects', href: '#', icon: <span>P</span> },
    ],
  },
]

describe('Sidebar', () => {
  it('renders a labelled nav with items', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('marks the active item as the current page', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('aria-current', 'page')
  })

  it('collapses to a rail, hiding labels', async () => {
    const user = userEvent.setup()
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
    expect(screen.queryByText('Dashboard')).toBeNull()
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
  })

  it('forwards the ref to the aside', () => {
    const ref = createRef<HTMLElement>()
    render(<Sidebar ref={ref} sections={sections} />)
    expect(ref.current?.tagName).toBe('ASIDE')
  })
})
