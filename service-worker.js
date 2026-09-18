"use strict";

/* =========================================================
   OFFLINE FIRST AID
   SERVICE WORKER
   ========================================================= */

const CACHE_NAME = "offline-first-aid-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",

    "./css/style.css",
    "./js/script.js",

    "./pages/first-aid.html",
    "./pages/bleeding.html",
    "./pages/burns.html",
    "./pages/choking.html",
    "./pages/injuries.html",
    "./pages/bites.html"
];

/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", (event) => {
    console.log("Offline First Aid Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(APP_FILES);
            })
            .then(() => {
                console.log(
                    "Offline First Aid: App files cached successfully."
                );

                return self.skipWaiting();
            })
            .catch((error) => {
                console.error(
                    "Offline First Aid: Cache installation failed.",
                    error
                );
            })
    );
});

/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", (event) => {
    console.log("Offline First Aid Service Worker: Activated.");

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log(
                                "Deleting old cache:",
                                cacheName
                            );

                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", (event) => {
    const request = event.request;

    /*
     * Only handle GET requests.
     */
    if (request.method !== "GET") {
        return;
    }

    /*
     * Don't cache API requests.
     *
     * Your JavaScript already has offline fallback data.
     */
    if (request.url.includes("/api/")) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {

                /*
                 * If file exists in cache,
                 * return it immediately.
                 */
                if (cachedResponse) {
                    return cachedResponse;
                }

                /*
                 * Otherwise try network.
                 */
                return fetch(request)
                    .then((networkResponse) => {

                        /*
                         * Save successful same-origin
                         * responses into cache.
                         */
                        if (
                            networkResponse &&
                            networkResponse.status === 200 &&
                            networkResponse.type === "basic"
                        ) {
                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(
                                        request,
                                        responseClone
                                    );
                                });
                        }

                        return networkResponse;
                    })
                    .catch(() => {

                        /*
                         * If the user is offline and requests
                         * an HTML page, show the main app.
                         */
                        if (
                            request.destination === "document"
                        ) {
                            return caches.match(
                                "./index.html"
                            );
                        }

                        /*
                         * For other unavailable resources,
                         * return a simple offline response.
                         */
                        return new Response(
                            "Offline First Aid is currently offline.",
                            {
                                status: 503,
                                statusText: "Offline"
                            }
                        );
                    });
            })
    );
});

/* =========================================================
   MESSAGE
   ========================================================= */

self.addEventListener("message", (event) => {

    if (!event.data) {
        return;
    }

    if (event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});