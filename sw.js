const CACHE_NAME = "cartita-app";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icono.png"
];


/* INSTALACIÓN */

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {

            return cache.addAll(ARCHIVOS);

        })

    );

});


/* ACTIVACIÓN */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(nombres => {

            return Promise.all(

                nombres
                    .filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


/* PETICIONES */

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);


    /*
       carta.png NO se guarda en caché.

       Así, cuando tú reemplaces la carta
       por una nueva, la app buscará
       directamente la versión actual.
    */

    if (
        url.pathname.endsWith("/carta.png")
    ) {

        event.respondWith(

            fetch(event.request, {
                cache: "no-store"
            })

        );

        return;

    }


    /*
       Los archivos principales se comprueban
       primero en internet.

       Si internet no está disponible,
       utiliza la versión guardada.
    */

    event.respondWith(

        fetch(event.request, {
            cache: "no-store"
        })
        .then(respuesta => {

            if (
                respuesta &&
                respuesta.status === 200 &&
                event.request.method === "GET"
            ) {

                const copia =
                    respuesta.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(
                            event.request,
                            copia
                        );

                    });

            }

            return respuesta;

        })
        .catch(() => {

            return caches.match(
                event.request
            );

        })

    );

});