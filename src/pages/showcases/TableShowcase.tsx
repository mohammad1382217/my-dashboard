import { useLang } from '../../i18n'
import { Table } from '../../components/ui/Table/Table'
import type { TableColumn } from '../../components/ui/Table/Table'
import { Badge } from '../../components/ui/Badge/Badge'

interface Invoice {
  id: string
  customer: string
  status: 'paid' | 'pending'
  amount: string
}

const STRINGS = {
  fa: {
    id: 'شناسه',
    customer: 'مشتری',
    status: 'وضعیت',
    amount: 'مبلغ',
    paid: 'پرداخت‌شده',
    pending: 'در انتظار',
    caption: 'فاکتورهای اخیر',
  },
  en: {
    id: 'Invoice',
    customer: 'Customer',
    status: 'Status',
    amount: 'Amount',
    paid: 'Paid',
    pending: 'Pending',
    caption: 'Recent invoices',
  },
} as const

const data: Invoice[] = [
  { id: 'INV-001', customer: 'Ada Lovelace', status: 'paid', amount: '$250' },
  { id: 'INV-002', customer: 'Grace Hopper', status: 'pending', amount: '$120' },
  { id: 'INV-003', customer: 'Linus Torvalds', status: 'paid', amount: '$80' },
]

/** Live demo of the data-driven Table. */
export function TableShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  const columns: TableColumn<Invoice>[] = [
    { key: 'id', header: t.id, className: 'font-medium text-fg' },
    { key: 'customer', header: t.customer },
    {
      key: 'status',
      header: t.status,
      cell: (row) => <Badge variant={row.status === 'paid' ? 'success' : 'warning'}>{row.status === 'paid' ? t.paid : t.pending}</Badge>,
    },
    { key: 'amount', header: t.amount, align: 'end' },
  ]

  return (
    <div className="w-full max-w-lg">
      <Table columns={columns} data={data} caption={t.caption} getRowKey={(row) => row.id} />
    </div>
  )
}
