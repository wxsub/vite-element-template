export const addPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(",") : [],
    [index, pos] = permission.split(",");
  userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos)
  return userPermission.join(",")
}

export const delPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(",") : [],
    [index, pos] = permission.split(",");
  userPermission[index] = (userPermission[index] || 0) & (~Math.pow(2, pos))
  return userPermission.join(",")
}

export const hasPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(",") : [],
    [index, pos] = permission.split(",");
  const permissionValue = Math.pow(2, pos)
  return (userPermission[index] & permissionValue) === permissionValue
}
