import { useLang } from '../../i18n'
import { DataTable } from '../../components/ui/DataTable/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable/DataTable'
import { Badge } from '../../components/ui/Badge/Badge'

interface User {
  name: string
  role: string
  status: 'active' | 'invited'
  seats: number
}

const STRINGS = {
  fa: {
    name: 'نام',
    role: 'نقش',
    status: 'وضعیت',
    seats: 'صندلی',
    active: 'فعال',
    invited: 'دعوت‌شده',
    prev: 'قبلی',
    next: 'بعدی',
  },
  en: {
    name: 'Name',
    role: 'Role',
    status: 'Status',
    seats: 'Seats',
    active: 'Active',
    invited: 'Invited',
    prev: 'Previous',
    next: 'Next',
  },
} as const

const data: User[] = [
  { name: 'Ada Lovelace', role: 'Owner', status: 'active', seats: 5 },
  { name: 'Grace Hopper', role: 'Admin', status: 'active', seats: 3 },
  { name: 'Linus Torvalds', role: 'Member', status: 'invited', seats: 1 },
  { name: 'Margaret Hamilton', role: 'Admin', status: 'active', seats: 4 },
  { name: 'Alan Turing', role: 'Member', status: 'invited', seats: 2 },
]

/** Live demo of the DataTable with sorting + pagination. */
export function DataTableShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: t.name, sortable: true, className: 'font-medium text-fg' },
    { key: 'role', header: t.role, sortable: true },
    {
      key: 'status',
      header: t.status,
      sortable: true,
      cell: (row) => <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>{row.status === 'active' ? t.active : t.invited}</Badge>,
    },
    { key: 'seats', header: t.seats, sortable: true, align: 'end' },
  ]

  return (
    <div className="w-full max-w-lg">
      <DataTable
        columns={columns}
        data={data}
        pageSize={3}
        initialSort={{ key: 'name', direction: 'asc' }}
        getRowKey={(row) => row.name}
        prevLabel={t.prev}
        nextLabel={t.next}
        pageInfo={(page, pages) => `${page} / ${pages}`}
      />
    </div>
  )
}
