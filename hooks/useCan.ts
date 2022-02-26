import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { validateUserPermissions } from '../utils/validateUserPermissions'

interface useCanParams {
  permissions?: string[]
  roles?: string[]
}

// only the client-side hook does not ensures security. If it was a sensitive data
// would be necessary to verify the permissions in the backend
export function useCan({ permissions, roles }: useCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) return false

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  })

  return userHasValidPermissions
}
