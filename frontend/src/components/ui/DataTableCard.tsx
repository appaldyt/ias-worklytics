type Props = {
  title: string
  children: React.ReactNode
}

export default function DataTableCard({ title, children }: Props) {
  return (
    <section className="panel-card">
      <h3 className="text-lg font-semibold mb-4 text-primaryText">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}
