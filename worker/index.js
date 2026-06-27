/**
 * ScholarPay Download Tracker — Cloudflare Worker
 *
 * 1. Logs download metadata to KV storage
 * 2. Redirects user to the APK file on Cloudflare CDN
 *
 * Deploy: npm wrangler deploy
 */

// ──────────────────────────────────────────────
// Configuration — Update these for your deployment
// ──────────────────────────────────────────────
const CONFIG = {
  // Public URL of the APK file (hosted on Cloudflare Pages or R2)
  APK_URL: 'https://scholarpay-download.pages.dev/scholarpay-v1.apk',

  // App metadata for logging
  APP_NAME: 'ScholarPay',
  APP_VERSION: '1.0.1',
}

export default {
  async fetch(request, env) {
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 })
    }

    const cf = request.cf || {}
    const now = new Date()

    // ── Build log entry ──────────────────────
    const logEntry = {
      app: CONFIG.APP_NAME,
      version: CONFIG.APP_VERSION,
      timestamp: now.toISOString(),
      date: now.toISOString().slice(0, 10), // YYYY-MM-DD for easy aggregation
      ip: request.headers.get('CF-Connecting-IP') || '',
      country: cf.country || '',
      city: cf.city || '',
      timezone: cf.timezone || '',
      userAgent: request.headers.get('User-Agent') || '',
      referer: request.headers.get('Referer') || 'direct',
      colo: cf.colo || '', // Cloudflare data center
    }

    // ── Write to KV ──────────────────────────
    // Key format: dl:<timestamp>:<random>
    const key = `dl:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`

    // Use waitUntil for fire-and-forget — doesn't block the response
    // Falls back to blocking if waitUntil isn't available
    const writeLog = async () => {
      try {
        await env.APP_DOWNLOADS.put(key, JSON.stringify(logEntry))

        // Update daily counter
        const dayKey = `counter:${logEntry.date}`
        const dayCount = parseInt((await env.APP_DOWNLOADS.get(dayKey)) || '0')
        await env.APP_DOWNLOADS.put(dayKey, String(dayCount + 1))

        // Update total counter
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

    // ── Redirect to APK ──────────────────────
    return Response.redirect(CONFIG.APK_URL, 302)
  },
}
