import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('exposes a group role and renders its buttons', () => {
    render(
      <ButtonGroup>
        <button>One</button>
        <button>Two</button>
      </ButtonGroup>,
    )
    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument()
  })

  it('applies vertical layout classes', () => {
    render(
      <ButtonGroup orientation="vertical">
        <button>One</button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('group')).toHaveClass('flex-col')
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ButtonGroup ref={ref} className="shadow">
        <button>One</button>
      </ButtonGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('shadow')
  })
})
