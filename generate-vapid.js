// ══════════════════════════════════════════════════
// הרץ פעם אחת: node generate-vapid.js
// יפיק VAPID keys שתצטרך ב-Supabase ו-PWA
// ══════════════════════════════════════════════════
const webpush = require('web-push')
const keys = webpush.generateVAPIDKeys()
console.log('VAPID_PUBLIC_KEY=', keys.publicKey)
console.log('VAPID_PRIVATE_KEY=', keys.privateKey)
console.log('\nשמור אותם — תצטרך אותם פעמיים:')
console.log('1. ב-Supabase Edge Function env vars')
console.log('2. בקובץ index.html — החלף __VAPID_PUBLIC_KEY__')
