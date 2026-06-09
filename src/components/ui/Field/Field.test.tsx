import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Field } from './Field'

describe('Field', () => {
  it('links the label to the control', () => {
    render(
      <Field label="Email">
        <input type="email" />
      </Field>,
    )
    // getByLabelText resolves the htmlFor <-> id wiring injected by Field.
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement)
  })

  it('shows a required marker', () => {
    render(
      <Field label="Name" required>
        <input />
      </Field>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('wires aria-describedby to the description', () => {
    render(
      <Field label="Email" description="We never share it.">
        <input />
      </Field>,
    )
    const input = screen.getByLabelText('Email')
    const descId = input.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    expect(document.getElementById(descId as string)).toHaveTextContent('We never share it.')
  })

  it('marks the control invalid and announces the error', () => {
    render(
      <Field label="Email" error="Required">
        <input />
      </Field>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('preserves an explicit child id', () => {
    render(
      <Field label="Email">
        <input id="my-email" />
      </Field>,
    )
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'my-email')
  })
})
