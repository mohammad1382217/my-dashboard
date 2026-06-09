import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

function renderTooltip() {
  return render(
    <Tooltip content="Helpful hint" delay={0}>
      <button type="button">Trigger</button>
    </Tooltip>,
  )
}

describe('Tooltip', () => {
  it('is hidden until the trigger is focused, then links via aria-describedby', async () => {
    renderTooltip()
    const trigger = screen.getByRole('button', { name: 'Trigger' })
    expect(screen.queryByRole('tooltip')).toBeNull()

    trigger.focus()

    const tip = await screen.findByRole('tooltip')
    expect(tip).toHaveTextContent('Helpful hint')
    expect(trigger).toHaveAttribute('aria-describedby', tip.id)
  })

  it('hides on blur', async () => {
    renderTooltip()
    const trigger = screen.getByRole('button')
    trigger.focus()
    await screen.findByRole('tooltip')

    trigger.blur()

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  })

  it('hides on Escape', async () => {
    const user = userEvent.setup()
    renderTooltip()
    const trigger = screen.getByRole('button')
    trigger.focus()
    await screen.findByRole('tooltip')

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  })
})
