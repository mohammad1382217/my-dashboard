import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'
import type { TabsProps } from './Tabs'

const ITEMS = [
  { value: 'account', label: 'Account', content: 'Account content' },
  { value: 'password', label: 'Password', content: 'Password content' },
  { value: 'notifications', label: 'Notifications', content: 'Notifications content' },
]

function Fixture(props: Partial<TabsProps>) {
  return <Tabs items={ITEMS} {...props} />
}

describe('Tabs', () => {
  it('selects the first tab by default and shows its panel', () => {
    render(<Fixture />)
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Account content')
  })

  it('honours an uncontrolled defaultValue', () => {
    render(<Fixture defaultValue="password" />)
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Password content')
  })

  it('selects a tab on click and fires onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Fixture onValueChange={onValueChange} />)

    await user.click(screen.getByRole('tab', { name: 'Notifications' }))

    expect(onValueChange).toHaveBeenCalledWith('notifications')
    expect(screen.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Notifications content')
  })

  it('respects a controlled value (no self-change without a handler)', async () => {
    const user = userEvent.setup()
    render(<Fixture value="account" />)

    await user.click(screen.getByRole('tab', { name: 'Password' }))

    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true')
  })

  it('reflects external updates when controlled', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('account')
      return <Fixture value={value} onValueChange={setValue} />
    }
    render(<Controlled />)

    await user.click(screen.getByRole('tab', { name: 'Password' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Password content')
  })

  it('uses a roving tabindex (only the selected tab is tabbable)', () => {
    render(<Fixture defaultValue="password" />)
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves selection with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    const tabs = screen.getAllByRole('tab')

    tabs[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('jumps to the first/last tab with Home/End', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    const tabs = screen.getAllByRole('tab')

    tabs[0].focus()
    await user.keyboard('{End}')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Home}')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('skips a disabled tab when navigating', async () => {
    const user = userEvent.setup()
    render(
      <Tabs
        items={[
          { value: 'a', label: 'A', content: 'A content' },
          { value: 'b', label: 'B', content: 'B content', disabled: true },
          { value: 'c', label: 'C', content: 'C content' },
        ]}
      />,
    )
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1]).toBeDisabled()

    tabs[0].focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute('aria-selected', 'true')
  })

  it('wires aria-controls and aria-labelledby between tab and panel', () => {
    render(<Fixture />)
    const tab = screen.getByRole('tab', { name: 'Account' })
    const panel = screen.getByRole('tabpanel')
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Tabs ref={ref} items={ITEMS} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges className overrides with twMerge', () => {
    const { container } = render(<Fixture className="gap-1" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('gap-1')
    expect(root.className).not.toContain('gap-4')
  })

  it('applies the pill variant style to the tabs', () => {
    render(<Fixture variant="pill" />)
    expect(screen.getByRole('tab', { name: 'Account' }).className).toContain('rounded-md')
  })
})
