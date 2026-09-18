"use strict";

/* =========================================================
   OFFLINE FIRST AID
   SERVICE WORKER
   ========================================================= */

const CACHE_NAME = "offline-first-aid-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./style.css",
    "./script.js",

    "./first-aid.html",
    "./bleeding.html",
    "./burns.html",
    "./choking.html",
    "./injuries.html",
    "./bites.html"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", (event) => {

    console.log(
        "Offline First Aid Service Worker: Installing..."
    );

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then((cache) => {

                return cache.addAll(APP_FILES);

            })

            .then(() => {

                console.log(
                    "Offline First Aid: All files cached successfully."
                );

                return self.skipWaiting();

            })

            .catch((error) => {

                console.error(
                    "Offline First Aid: Cache installation failed:",
                    error
                );

            })

    );

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", (event) => {

    console.log(
        "Offline First Aid Service Worker: Activated."
    );

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


    /* Only GET requests */

    if (request.method !== "GET") {

        return;

    }


    /* Do not cache API requests */

    if (request.url.includes("/api/")) {

        return;

    }


    event.respondWith(

        caches.match(request)

            .then((cachedResponse) => {


                /* Return cached file */

                if (cachedResponse) {

                    return cachedResponse;

                }


                /* Try internet */

                return fetch(request)

                    .then((networkResponse) => {


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


                        /* Offline HTML fallback */

                        if (
                            request.destination === "document"
                        ) {

                            return caches.match(
                                "./index.html"
                            );

                        }


                        /* Offline resource fallback */

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


    if (
        event.data.type === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});
