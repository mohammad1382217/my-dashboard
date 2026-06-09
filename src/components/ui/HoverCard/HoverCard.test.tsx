import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HoverCard } from './HoverCard'

describe('HoverCard', () => {
  it('opens on hover and closes on leave', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0} trigger={<button>@ada</button>}>
        <p>Ada Lovelace</p>
      </HoverCard>,
    )
    const trigger = screen.getByRole('button', { name: '@ada' })

    expect(screen.queryByText('Ada Lovelace')).toBeNull()
    await user.hover(trigger)
    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument())
    await user.unhover(trigger)
    await waitFor(() => expect(screen.queryByText('Ada Lovelace')).toBeNull())
  })

  it('opens on focus', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0} trigger={<button>@ada</button>}>
        <p>Ada Lovelace</p>
      </HoverCard>,
    )
    await user.tab()
    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument())
  })
})
