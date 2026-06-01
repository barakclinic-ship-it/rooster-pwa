// ══════════════════════════════════════════════════
// Rooster PWA — Service Worker
// ══════════════════════════════════════════════════

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

// ── Push notification received ────────────────────
self.addEventListener('push', event => {
  if (!event.data) return

  let data
  try { data = event.data.json() }
  catch { data = { title: 'Rooster', body: event.data.text(), url: 'https://wa.me/' } }

  const options = {
    body: data.body || '',
    icon: '/icon192.png',
    badge: '/icon96.png',
    vibrate: [200, 100, 200],
    tag: 'rooster-' + (data.msgId || Date.now()),
    renotify: true,
    requireInteraction: true,   // stays until user taps
    data: {
      url: data.url || 'https://wa.me/',
      phone: data.phone,
      messages: data.messages,
      msgId: data.msgId
    },
    actions: [
      { action: 'open', title: '📱 פתח WhatsApp' },
      { action: 'dismiss', title: 'בטל' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Rooster', options)
  )
})

// ── Notification click ────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const { url, phone, messages, msgId } = event.notification.data || {}

  // Build WhatsApp URL with first message pre-filled
  const firstMsg = Array.isArray(messages) ? messages[0] : (messages || '')
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(firstMsg)}`

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      // Focus existing window if open
      for (const w of wins) {
        if (w.url.includes('wa.me') || w.url.includes('whatsapp')) {
          return w.focus()
        }
      }
      // Open WhatsApp
      return clients.openWindow(waUrl)
    })
  )

  // Notify PWA to mark as sent (via postMessage to any open client)
  clients.matchAll({ type: 'window' }).then(wins => {
    wins.forEach(w => w.postMessage({ type: 'MARK_SENT', msgId }))
  })
})
