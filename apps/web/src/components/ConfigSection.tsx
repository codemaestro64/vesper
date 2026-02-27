import type { ReactNode } from 'react'
import ConfigSectionTitle from '@/components/ConfigSectionTitle'

interface ConfigSectionProps {
  title: string
  step: number
  children: ReactNode
}

/**
 * A labeled configuration step section.
 * Combines the step indicator, title, and its content into one unit.
 */
export default function ConfigSection({ title, step, children }: ConfigSectionProps) {
  return (
    <section>
      <ConfigSectionTitle title={title} step={step} />
      {children}
    </section>
  )
}
