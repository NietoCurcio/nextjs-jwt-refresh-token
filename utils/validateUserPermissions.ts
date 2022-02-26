interface User {
  permissions: string[]
  roles: string[]
}

interface validateUserPermissionsParams {
  user: User
  permissions?: string[]
  roles?: string[]
}

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: validateUserPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) =>
      user.permissions.includes(permission)
    )

    if (!hasAllPermissions) return false
  }

  if (roles?.length > 0) {
    const hasAllroles = roles.some((role) => {
      user.roles.includes(role)
    })

    if (!hasAllroles) return false
  }

  return true
}
