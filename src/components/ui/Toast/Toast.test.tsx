import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from './Toast'

type Kind = 'success' | 'error' | 'warning' | 'gray'

function Trigger({ kind = 'success', duration }: { kind?: Kind; duration?: number }) {
  const toast = useToast()
  const fire = () => {
    const options = { description: 'Your changes are saved.', duration }
    if (kind === 'success') toast.success('Saved', options)
    else if (kind === 'error') toast.error('Saved', options)
    else if (kind === 'warning') toast.warning('Saved', options)
    else toast.message('Saved', options)
  }
  return (
    <button type="button" onClick={fire}>
      Trigger
    </button>
  )
}

function renderWithProvider(ui: React.ReactNode) {
  return render(<ToastProvider duration={10_000}>{ui}</ToastProvider>)
}

describe('Toast', () => {
  it('throws if useToast is used outside a provider', () => {
    function Orphan() {
      useToast()
      return null
    }
    expect(() => render(<Orphan />)).toThrow(/must be used within <ToastProvider>/)
  })

  it('shows a toast with title and description when triggered', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)

    await user.click(screen.getByRole('button', { name: 'Trigger' }))

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes are saved.')).toBeInTheDocument()
  })

  it('uses role="alert" for errors and role="status" otherwise', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger kind="error" />)

    await user.click(screen.getByRole('button', { name: 'Trigger' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Saved')
  })

  it('stacks multiple toasts', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)

    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    await user.click(screen.getByRole('button', { name: 'Trigger' }))

    expect(screen.getAllByText('Saved')).toHaveLength(2)
  })

  it('dismisses via the close button', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)

    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
  })

  it('positions the viewport per the position prop', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <ToastProvider position="top-left">
        <Trigger />
      </ToastProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    const viewport = baseElement.querySelector('.fixed') as HTMLElement
    expect(viewport.className).toContain('top-4')
    expect(viewport.className).toContain('left-4')
  })

  it('auto-dismisses after its duration', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger duration={50} />)

    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
  })
})
