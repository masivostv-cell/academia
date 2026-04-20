// Nombre de la versión de caché
const CACHE_NAME = 'gestor-escolar-v1';

// Archivos básicos para guardar en caché
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(ASSETS_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});

// 2. Activación y limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Intercepción de peticiones (Modo Offline / Instalación)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(() => new Response('Offline - No hay conexión a internet'))
    );
});