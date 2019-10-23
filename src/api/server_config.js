function resolveIp() {
  const mode = process.env.NODE_ENV.trim()
  if (mode === 'development') {
    return {
      login: '/log',
      logic: '/fangman',
      another: '/hahha',
      test: '/test'
    }
  }
  return process.env.ENV_RGV === 'old'
    ? {
        login: '//passport.leekerlabs.com',
        logic: 'https://dbapp-api.leekerlabs.com',
        another: 'https://dbapp-api.leekerlabs.com'
      }
    : {
        login: 'http://dash-passport-api.tbnb.io:10101',
        other: 'http://dash-update-api.tbnb.io:10101',
        logic: 'http://dash-update-api.tbnb.io:10101'
      }
}
export const serverIp = resolveIp()
