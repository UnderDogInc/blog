interface ApiBaseConfig {
  apiProxyTarget?: string
  public: {
    apiBase: string
    apiOrigin?: string
  }
}

export function resolveApiBase(config: ApiBaseConfig, isServer: boolean): string {
  if (!isServer) {
    return config.public.apiBase
  }

  const apiBase = config.public.apiBase

  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    return apiBase
  }

  const path = apiBase.startsWith('/') ? apiBase : `/${apiBase}`
  const proxyTarget = config.apiProxyTarget?.replace(/\/$/, '')

  if (proxyTarget) {
    return `${proxyTarget}${path}`
  }

  const origin = config.public.apiOrigin?.replace(/\/$/, '')

  if (origin) {
    return `${origin}${path}`
  }

  return apiBase
}
