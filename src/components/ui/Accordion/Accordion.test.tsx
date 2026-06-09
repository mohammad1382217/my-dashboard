import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'
import type { AccordionItem } from './Accordion'

const ITEMS: AccordionItem[] = [
  { id: 'one', title: 'One', content: 'First panel body' },
  { id: 'two', title: 'Two', content: 'Second panel body' },
  { id: 'three', title: 'Three', content: 'Third panel body' },
]

describe('Accordion', () => {
  it('renders each header as a button wired to its panel', () => {
    render(<Accordion items={ITEMS} defaultOpen="one" />)
    const trigger = screen.getByRole('button', { name: 'One' })
    const panel = screen.getByRole('region', { name: 'One' })

    expect(trigger).toBeInstanceOf(HTMLButtonElement)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id)
  })

  it('wraps each trigger in a heading element (WAI-ARIA accordion pattern)', () => {
    render(<Accordion items={ITEMS} />)
    // Default heading level is h3.
    const heading = screen.getByRole('heading', { level: 3, name: 'One' })
    expect(heading.tagName).toBe('H3')
    // The trigger button lives inside the heading.
    const trigger = screen.getByRole('button', { name: 'One' })
    expect(heading).toContainElement(trigger)
  })

  it('honours a custom headingLevel', () => {
    render(<Accordion items={ITEMS} headingLevel="h2" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'One' })
    expect(heading.tagName).toBe('H2')
  })

  it('hides collapsed panels from the accessibility tree', () => {
    render(<Accordion items={ITEMS} />)
    // Nothing open by default (single, no defaultOpen).
    expect(screen.queryByRole('region')).toBeNull()
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a panel on click and reflects it in aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const trigger = screen.getByRole('button', { name: 'Two' })

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: 'Two' })).toBeInTheDocument()
  })

  it('rotates the chevron with a legacy-safe transform class, not the modern rotate utility', async () => {
    const user = userEvent.setup()
    const { container } = render(<Accordion items={ITEMS} />)
    const trigger = screen.getByRole('button', { name: 'One' })
    const chevron = container.querySelector('svg')
    expect(chevron).not.toBeNull()

    // The modern Tailwind rotate utility emits the individual `rotate` CSS
    // property (Chrome 104+) that Lightning CSS can't polyfill and that snaps on
    // the old-engine floor. Built at runtime so Tailwind's content scanner can't
    // harvest the literal and emit a dead rule into the bundle.
    const modernRotateUtility = ['rotate', '180'].join('-')

    // Closed: explicit `transform` shorthand only.
    expect(chevron?.getAttribute('class')).toContain('transform-[rotate(0deg)]')
    expect(chevron?.getAttribute('class')).not.toContain(modernRotateUtility)

    await user.click(trigger)

    expect(chevron?.getAttribute('class')).toContain('transform-[rotate(180deg)]')
    expect(chevron?.getAttribute('class')).not.toContain(modernRotateUtility)
  })

  it('can hide the chevron globally and per item', () => {
    const items: AccordionItem[] = [
      { id: 'a', title: 'A', content: 'Alpha' },
      { id: 'b', title: 'B', content: 'Bravo', hideChevron: false },
    ]
    const { container } = render(<Accordion items={items} hideChevron />)
    // Global hideChevron removes every chevron; per-item false re-enables row B.
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(1)
  })

  it('collapses an open panel when collapsible (single, default)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} defaultOpen="one" />)
    const trigger = screen.getByRole('button', { name: 'One' })

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps one panel open in single non-collapsible mode', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} collapsible={false} defaultOpen="one" />)
    const one = screen.getByRole('button', { name: 'One' })

    // Clicking the already-open item must NOT close it.
    await user.click(one)
    expect(one).toHaveAttribute('aria-expanded', 'true')

    // Opening another closes the first.
    await user.click(screen.getByRole('button', { name: 'Two' }))
    expect(one).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('allows several panels open at once in multiple mode', async () => {
    const user = userEvent.setup()
    render(<Accordion type="multiple" items={ITEMS} />)

    await user.click(screen.getByRole('button', { name: 'One' }))
    await user.click(screen.getByRole('button', { name: 'Two' }))

    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onOpenChange with a string (or null) in single mode', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={ITEMS} defaultOpen="one" onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Two' }))
    expect(onOpenChange).toHaveBeenLastCalledWith('two')

    await user.click(screen.getByRole('button', { name: 'Two' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(null)
  })

  it('calls onOpenChange with an array in multiple mode', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Accordion type="multiple" items={ITEMS} defaultOpen={['one']} onOpenChange={onOpenChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Two' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(['one', 'two'])
  })

  it('respects a controlled open prop and does not self-update', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={ITEMS} open="one" onOpenChange={onOpenChange} />)

    const two = screen.getByRole('button', { name: 'Two' })
    await user.click(two)

    // Controlled: state only changes if the parent updates `open`.
    expect(onOpenChange).toHaveBeenCalledWith('two')
    expect(two).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('updates when a controlling parent changes open', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState<string | null>('one')
      return <Accordion items={ITEMS} open={open} onOpenChange={setOpen} />
    }
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'Two' }))

    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves focus with Down/Up arrows (roving, wrapping)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const [one, two, three] = ['One', 'Two', 'Three'].map((name) =>
      screen.getByRole('button', { name }),
    )

    one.focus()
    await user.keyboard('{ArrowDown}')
    expect(two).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(three).toHaveFocus()

    // Wraps back to the first.
    await user.keyboard('{ArrowDown}')
    expect(one).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(three).toHaveFocus()
  })

  it('jumps to first/last with Home/End', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const two = screen.getByRole('button', { name: 'Two' })
    two.focus()

    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'Three' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus()
  })

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const one = screen.getByRole('button', { name: 'One' })

    one.focus()
    await user.keyboard('{Enter}')
    expect(one).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(one).toHaveAttribute('aria-expanded', 'false')
  })

  it('disables an item and skips it during arrow navigation', async () => {
    const user = userEvent.setup()
    const items: AccordionItem[] = [
      { id: 'one', title: 'One', content: 'First' },
      { id: 'two', title: 'Two', content: 'Second', disabled: true },
      { id: 'three', title: 'Three', content: 'Third' },
    ]
    render(<Accordion items={items} />)

    const two = screen.getByRole('button', { name: 'Two' })
    expect(two).toBeDisabled()

    const one = screen.getByRole('button', { name: 'One' })
    one.focus()
    await user.keyboard('{ArrowDown}')
    // Skips the disabled middle item.
    expect(screen.getByRole('button', { name: 'Three' })).toHaveFocus()
  })

  it('merges className overrides with twMerge on the root', () => {
    render(<Accordion items={ITEMS} className="rounded-full" data-testid="root" />)
    const root = screen.getByTestId('root')
    expect(root.className).toContain('rounded-full')
    expect(root.className).not.toContain('rounded-md')
  })
})
