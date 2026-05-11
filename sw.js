// Service Worker: Reklama tarmoqlarini bloklash
const AD_HOSTS = [
    'appsgeyser.com',
    'googleadservices.com',
    'googlesyndication.com',
    'doubleclick.net',
    'adnxs.com',
    'amazon-adsystem.com',
    'ads.facebook.com',
    'advertising.com',
    'moatads.com',
    'popads.net',
    'adform.net',
    'criteo.com',
    'outbrain.com',
    'taboola.com',
    'adsafeprotected.com',
    'pagead2.googlesyndication.com',
    'tpc.googlesyndication.com',
    'adservice.google.com',
];

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = event.request.url.toLowerCase();
    
    const isAd = AD_HOSTS.some(host => url.includes(host));
    
    if (isAd) {
        // Reklama so'rovini bloklash: bo'sh javob qaytaramiz
        event.respondWith(
            new Response('', {
                status: 200,
                statusText: 'Blocked by ad blocker',
                headers: { 'Content-Type': 'text/plain' }
            })
        );
        return;
    }
    
    // Reklama emas - oddiy so'rovni o'tkazib yuboramiz
    event.respondWith(fetch(event.request));
});
