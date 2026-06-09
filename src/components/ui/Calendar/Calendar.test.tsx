import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from './Calendar'

const jan2024 = new Date(2024, 0, 1)

describe('Calendar', () => {
  it('renders the month title', () => {
    render(<Calendar defaultMonth={jan2024} locale="en-US" />)
    expect(screen.getByText(/January 2024/)).toBeInTheDocument()
  })

  it('selects a day and reports a Date', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar defaultMonth={jan2024} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '15' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    const date = onChange.mock.calls[0][0] as Date
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0)
    expect(date.getDate()).toBe(15)
  })

  it('marks the selected day as pressed', () => {
    render(<Calendar value={new Date(2024, 0, 15)} defaultMonth={jan2024} />)
    expect(screen.getByRole('button', { name: '15' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('navigates to the previous month', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={jan2024} locale="en-US" />)
    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByText(/December 2023/)).toBeInTheDocument()
  })

  it('disables days before min', () => {
    render(<Calendar defaultMonth={jan2024} min={new Date(2024, 0, 10)} />)
    expect(screen.getByRole('button', { name: '5' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '20' })).not.toBeDisabled()
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Calendar ref={ref} defaultMonth={jan2024} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
