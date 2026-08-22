const CACHE_NAME =
    "trex-app-v3";


const ARCHIVOS =
    [
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./icono.png"
    ];



/* =====================================
   INSTALACIÓN
===================================== */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                cache => {

                    return cache.addAll(
                        ARCHIVOS
                    );

                }
            )

        );


        self.skipWaiting();

    }
);



/* =====================================
   ACTIVACIÓN
===================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys().then(
                nombres => {

                    return Promise.all(

                        nombres
                            .filter(
                                nombre =>
                                    nombre !==
                                    CACHE_NAME
                            )
                            .map(
                                nombre =>
                                    caches.delete(
                                        nombre
                                    )
                            )

                    );

                }
            )

        );


        self.clients.claim();

    }
);



/* =====================================
   PETICIONES
===================================== */

self.addEventListener(
    "fetch",
    event => {

        const url =
            new URL(
                event.request.url
            );


        /*
           CARTA

           La carta nunca se guarda
           en la caché.

           Siempre se busca la versión
           actual de GitHub.
        */

        if (
            url.pathname.endsWith(
                "/carta.png"
            )
        ) {

            event.respondWith(

                fetch(
                    event.request,
                    {
                        cache: "no-store"
                    }
                ).catch(
                    () => {

                        return new Response(
                            "",
                            {
                                status: 404
                            }
                        );

                    }
                )

            );

            return;

        }



        /*
           ARCHIVOS DE LA APP

           Primero intenta conseguir
           la versión nueva de Internet.

           Si no hay conexión,
           utiliza la versión guardada.
        */

        event.respondWith(

            fetch(
                event.request,
                {
                    cache: "no-cache"
                }
            )
            .then(
                respuesta => {

                    if (
                        respuesta &&
                        respuesta.status === 200
                    ) {

                        const copia =
                            respuesta.clone();


                        caches.open(
                            CACHE_NAME
                        ).then(
                            cache => {

                                cache.put(
                                    event.request,
                                    copia
                                );

                            }
                        );

                    }


                    return respuesta;

                }
            )
            .catch(
                () => {

                    return caches.match(
                        event.request
                    );

                }
            )

        );

    }
);