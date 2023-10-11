interface TokenPayload {
  exp: number
}

export const isTokenValid = (token: string): boolean => {
  try {
    const payload: TokenPayload = JSON.parse(atob(token.split(".")[1]))
    const expirationTimeInSeconds = payload.exp
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)
    return currentTimeInSeconds <= expirationTimeInSeconds
  } catch {
    return false
  }
}
