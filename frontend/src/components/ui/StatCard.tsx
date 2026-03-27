type Props = {
  label: string
  value: string | number
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'brand'
}

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-primaryText',
  success: 'text-green-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
  brand: 'text-brand-600',
}

export default function StatCard({ label, value, tone = 'default' }: Props) {
  return (
    <div className="panel-card">
      <p className="muted">{label}</p>
      <p className={`text-3xl font-bold ${toneClass[tone]}`}>{value}</p>
    </div>
  )
}
