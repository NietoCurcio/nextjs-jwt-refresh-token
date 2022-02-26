import { ReactNode } from 'react'
import { useCan } from '../hooks/useCan'

interface CanProps {
  children: ReactNode
  permissions?: string[]
  roles?: string[]
}

export function Can({ children, permissions, roles }: CanProps) {
  const userCanSeeComponente = useCan({
    permissions,
    roles,
  })

  if (!userCanSeeComponente) return null

  return <>{children}</>
}
