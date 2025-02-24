
export const getToken = () => {
    const result = localStorage.getItem('token')
    return result
}

export const setToken = val => {
  localStorage.setItem('token', val)
}

export const getUserInfo = () => {
  const result = sessionStorage.getItem('userInfo') ?? '{}'
  return JSON.parse(result)
}
export const setUserInfo = val => {
  const str = JSON.stringify(val || {})
  sessionStorage.setItem('userInfo', str)
}

export const clearStore = () => {
  localStorage.clear()
}
