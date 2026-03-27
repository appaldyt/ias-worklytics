type Props = {
  title?: string
  children: React.ReactNode
}

export default function FormCard({ title, children }: Props) {
  return (
    <section className="panel-card">
      {title ? <h3 className="text-lg font-semibold mb-4 text-primaryText">{title}</h3> : null}
      {children}
    </section>
  )
}
