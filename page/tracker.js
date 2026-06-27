const CONFIG = {
  APK_URL: 'https://github.com/Faareh-Ahmed/ScholarPay-Install/releases/download/v1.0.0/scholarpay.apk',
  APP_NAME: 'ScholarPay',
  APP_VERSION: '1.0.1',
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    if (url.pathname !== '/download') {
      return new Response('Not Found', { status: 404 })
    }

    const cf = request.cf || {}
    const now = new Date()

    const logEntry = {
      app: CONFIG.APP_NAME,
      version: CONFIG.APP_VERSION,
      timestamp: now.toISOString(),
      date: now.toISOString().slice(0, 10),
      ip: request.headers.get('CF-Connecting-IP') || '',
      country: cf.country || '',
      city: cf.city || '',
      timezone: cf.timezone || '',
      userAgent: request.headers.get('User-Agent') || '',
      referer: request.headers.get('Referer') || 'direct',
      colo: cf.colo || '',
    }

    const key = `dl:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`

    const writeLog = async () => {
      try {
        if (!env.APP_DOWNLOADS) {
          console.error('KV namespace APP_DOWNLOADS is not bound')
          return
        }
        await env.APP_DOWNLOADS.put(key, JSON.stringify(logEntry))
        const dayKey = `counter:${logEntry.date}`
        const dayCount = parseInt((await env.APP_DOWNLOADS.get(dayKey)) || '0')
        await env.APP_DOWNLOADS.put(dayKey, String(dayCount + 1))
        const totalKey = 'counter:total'
        const totalCount = parseInt((await env.APP_DOWNLOADS.get(totalKey)) || '0')
        await env.APP_DOWNLOADS.put(totalKey, String(totalCount + 1))
      } catch (err) {
        console.error('KV write failed:', err)
      }
    }

    if (typeof request.waitUntil === 'function') {
      request.waitUntil(writeLog())
    } else {
      await writeLog()
    }

    return new Response(null, {
      status: 302,
      headers: {
        'Location': CONFIG.APK_URL,
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="scholarpay.apk"'
      }
    });
  }
}
