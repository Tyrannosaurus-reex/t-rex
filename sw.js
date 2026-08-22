const CACHE_NAME =
    "trex-app-v2";


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
           CARTA.Png
           
           NUNCA se guarda en caché.
           
           Siempre se pide la versión
           actual que esté en GitHub.
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
           Los demás archivos:
           
           primero intenta la red.
           
           Si no hay conexión,
           utiliza la versión guardada.
        */

        event.respondWith(

            fetch(
                event.request
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