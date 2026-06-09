import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('marks the current page', () => {
    render(<Pagination page={2} count={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Pagination 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} count={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('disables Next on the last page', () => {
    render(<Pagination page={5} count={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('reports the chosen page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={2} count={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Pagination 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('collapses long ranges with ellipses', () => {
    render(<Pagination page={10} count={20} onPageChange={() => {}} />)
    // First and last always present, middle is windowed.
    expect(screen.getByRole('button', { name: 'Pagination 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pagination 20' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pagination 5' })).toBeNull()
  })
})
