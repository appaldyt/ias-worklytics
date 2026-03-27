type Props = {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export default function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-primaryText">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-secondaryText">{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  )
}
