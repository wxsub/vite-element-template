const permissions = {
  SYS_SETTING: {
    value: "0,0", // index = 0, pos = 0
    info: "系统权限"
  }
}

export const add = (code, permission) => {
  const userPermission = code ? code.split(",") : [],
    [index, pos] = permission.split(",").map(Number);

  if (isNaN(index) || isNaN(pos)) {
    throw new Error('Permission index and position must be numbers')
  }

  userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos)
  return userPermission.join(",")
}

export const remove = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(",") : [],
    [index, pos] = permission.split(",");
  userPermission[index] = (userPermission[index] || 0) & (~Math.pow(2, pos))
  return userPermission.join(",")
}

export const has = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(",") : [],
    [index, pos] = permission.split(",");
  const permissionValue = Math.pow(2, pos)
  return (userPermission[index] & permissionValue) === permissionValue
}

export const list = code => {
  const results = []
  if (!code) return results
  Object.values(permissions).forEach(permission => {
    if (has(code, permission)) {
      results.push(permission.info)
    }
  })
  return results
}
