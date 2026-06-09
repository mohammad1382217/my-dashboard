import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from './Popover'

describe('Popover', () => {
  it('opens and closes on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger="Open">
        <p>Panel body</p>
      </Popover>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger="Open">
        <p>Panel body</p>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('closes on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Popover trigger="Open">
          <p>Panel body</p>
        </Popover>
        <button>Outside</button>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('forwards the ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Popover ref={ref} trigger="Open">
        x
      </Popover>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
