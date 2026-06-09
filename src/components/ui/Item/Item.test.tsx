import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Item } from './Item'

describe('Item', () => {
  it('renders title and description', () => {
    render(<Item title="Ada Lovelace" description="Programmer" />)
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Programmer')).toBeInTheDocument()
  })

  it('renders leading and trailing slots', () => {
    render(<Item leading={<span>L</span>} trailing={<span>T</span>} title="x" />)
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('lets children replace the title/description stack', () => {
    render(
      <Item title="ignored">
        <span>Custom body</span>
      </Item>,
    )
    expect(screen.getByText('Custom body')).toBeInTheDocument()
    expect(screen.queryByText('ignored')).toBeNull()
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Item ref={ref} className="shadow" title="x" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('shadow')
  })
})
