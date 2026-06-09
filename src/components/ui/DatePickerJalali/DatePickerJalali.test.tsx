import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toJalaali } from 'jalaali-js'
import { DatePickerJalali } from './DatePickerJalali'

// 2024-03-20 is Nowruz 1403 → 1403/01/01.
const NOWRUZ_1403 = new Date(2024, 2, 20)

describe('DatePickerJalali', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<DatePickerJalali label="تاریخ" placeholder="یک تاریخ" />)
    expect(screen.getByRole('button')).toHaveTextContent('یک تاریخ')
  })

  it('formats the value as Jalali with Persian digits', () => {
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('۱۴۰۳/۰۱/۰۱')
  })

  it('opens the calendar on click', async () => {
    const user = userEvent.setup()
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={() => {}} />)

    expect(screen.queryByRole('dialog')).toBeNull()
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/فروردین/)).toBeInTheDocument()
  })

  it('reports the picked day as a Gregorian Date and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={onChange} />)

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button', { name: '۱۵' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(toJalaali(onChange.mock.calls[0][0])).toEqual({ jy: 1403, jm: 1, jd: 15 })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('navigates between months', async () => {
    const user = userEvent.setup()
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={() => {}} />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText(/فروردین/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'بعدی' }))
    expect(screen.getByText(/اردیبهشت/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'قبلی' }))
    expect(screen.getByText(/فروردین/)).toBeInTheDocument()
  })

  it('opens the month grid and selects a month', async () => {
    const user = userEvent.setup()
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={() => {}} />)

    await user.click(screen.getByRole('button'))
    // header month button → month grid
    await user.click(screen.getByRole('button', { name: 'فروردین' }))
    // pick a month → back to the day grid for that month
    await user.click(screen.getByRole('button', { name: 'مرداد' }))

    expect(screen.getByRole('button', { name: 'مرداد' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
  })

  it('opens the year grid and selects a year', async () => {
    const user = userEvent.setup()
    render(<DatePickerJalali label="تاریخ" value={NOWRUZ_1403} onChange={() => {}} />)

    await user.click(screen.getByRole('button'))
    // header year button (۱۴۰۳) → year grid
    await user.click(screen.getByRole('button', { name: '۱۴۰۳' }))
    // pick a year → drills into the month grid for that year
    await user.click(screen.getByRole('button', { name: '۱۴۰۵' }))

    expect(screen.getByText('۱۴۰۵')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'مرداد' })).toBeInTheDocument()
  })

  it('works as a controlled picker', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [date, setDate] = useState<Date | null>(NOWRUZ_1403)
      return <DatePickerJalali label="تاریخ" value={date} onChange={setDate} />
    }
    render(<Controlled />)
    expect(screen.getByRole('button')).toHaveTextContent('۱۴۰۳/۰۱/۰۱')

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button', { name: '۱۵' }))

    expect(screen.getByRole('button')).toHaveTextContent('۱۴۰۳/۰۱/۱۵')
  })

  it('can be disabled', async () => {
    const user = userEvent.setup()
    render(<DatePickerJalali label="تاریخ" disabled />)
    const trigger = screen.getByRole('button')

    expect(trigger).toBeDisabled()
    await user.click(trigger)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows the error, marks it invalid and hides the helper text', () => {
    render(<DatePickerJalali label="تاریخ" helperText="راهنما" error="تاریخ نامعتبر است." />)
    const trigger = screen.getByRole('button')
    const errorNode = screen.getByText('تاریخ نامعتبر است.')

    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger.getAttribute('aria-describedby')).toContain(errorNode.id)
    expect(screen.queryByText('راهنما')).not.toBeInTheDocument()
  })

  it('forwards the ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<DatePickerJalali label="تاریخ" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
