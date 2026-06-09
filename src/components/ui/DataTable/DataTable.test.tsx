import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable'

interface Person {
  name: string
  age: number
}

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true, align: 'end' },
]

const data: Person[] = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
]

function firstBodyRowText() {
  const rows = screen.getAllByRole('row')
  return within(rows[1]).getAllByRole('cell')[0].textContent
}

describe('DataTable', () => {
  it('renders rows in source order initially', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(firstBodyRowText()).toBe('Charlie')
  })

  it('sorts ascending then descending on header click', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={data} />)
    const header = screen.getByRole('button', { name: /Name/ })

    await user.click(header)
    expect(firstBodyRowText()).toBe('Alice')
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')

    await user.click(header)
    expect(firstBodyRowText()).toBe('Charlie')
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
  })

  it('paginates when pageSize is set', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={data} pageSize={2} />)
    // header row + 2 data rows
    expect(screen.getAllByRole('row')).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    // header row + 1 remaining data row
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })
})
