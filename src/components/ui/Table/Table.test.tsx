import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './Table'
import type { TableColumn } from './Table'

interface Row {
  name: string
  role: string
}

const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role', align: 'end' },
]

const data: Row[] = [
  { name: 'Ada', role: 'Engineer' },
  { name: 'Linus', role: 'Maintainer' },
]

describe('Table', () => {
  it('renders headers and rows', () => {
    render(<Table columns={columns} data={data} />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Maintainer' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // header + 2 data rows
  })

  it('supports a custom cell renderer', () => {
    render(<Table columns={[{ key: 'name', header: 'Name', cell: (r) => <strong>{r.name}!</strong> }]} data={data} />)
    expect(screen.getByText('Ada!')).toBeInTheDocument()
  })

  it('shows empty content when there is no data', () => {
    render(<Table columns={columns} data={[]} emptyContent="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders a caption', () => {
    render(<Table columns={columns} data={data} caption="Team" />)
    expect(screen.getByText('Team')).toBeInTheDocument()
  })
})
