const isBrowser = typeof window !== 'undefined'

export const getToken = () => {
    if (!isBrowser) return null
    const result = localStorage.getItem('token')
    return result
}

export const setToken = val => {
    if (!isBrowser) return
    localStorage.setItem('token', val)
}

export const getUserInfo = () => {
    if (!isBrowser) return {}
    const result = sessionStorage.getItem('userInfo') ?? '{}'
    return JSON.parse(result)
}

export const setUserInfo = val => {
    if (!isBrowser) return
    const str = JSON.stringify(val || {})
    sessionStorage.setItem('userInfo', str)
}

export const clearStore = () => {
    if (!isBrowser) return
    localStorage.clear()
}
