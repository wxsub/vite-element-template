export const PERMISSIONS = {
    VIEW: 1 << 0,   // 1 (0001)
    CREATE: 1 << 1, // 2 (0010)
    EDIT: 1 << 2,   // 4 (0100)
    DELETE: 1 << 3, // 8 (1000)
    EXPORT: 1 << 4, // 16 (10000)
    IMPORT: 1 << 5  // 32 (100000)
} as const

export type PermissionName = keyof typeof PERMISSIONS
export const PERMISSION_NAMES = Object.keys(PERMISSIONS) as PermissionName[]

export function parsePermission(permissionValue: number): Record<PermissionName, boolean> {
  return PERMISSION_NAMES.reduce((acc, name) => {
    acc[name] = (permissionValue & PERMISSIONS[name]) === PERMISSIONS[name]
    return acc
  }, {} as Record<PermissionName, boolean>)
}

export function generatePermissionValue(permissions: Record<PermissionName, boolean>): number {
  return PERMISSION_NAMES.reduce((value, name) => {
    return permissions[name] ? value | PERMISSIONS[name] : value
  }, 0)
}

export function addPermission(base: number, permission: number): number {
  return base | permission
}

export function removePermission(base: number, permission: number): number {
  return base & ~permission
}

export function hasPermission(permissionValue: number, permission: number): boolean {
  return (permissionValue & permission) === permission
}