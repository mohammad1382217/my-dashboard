import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputGroup } from './InputGroup'

describe('InputGroup', () => {
  it('renders leading and trailing addons around the input', () => {
    render(<InputGroup leading={<span>@</span>} trailing={<span>.com</span>} placeholder="user" />)
    expect(screen.getByText('@')).toBeInTheDocument()
    expect(screen.getByText('.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('user')).toBeInTheDocument()
  })

  it('accepts typing', async () => {
    const user = userEvent.setup()
    render(<InputGroup placeholder="user" />)
    const input = screen.getByPlaceholderText('user')
    await user.type(input, 'ada')
    expect(input).toHaveValue('ada')
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<InputGroup ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
