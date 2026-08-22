const CACHE_NAME =
    "trex-app-v4";


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

           Nunca se guarda en caché.
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
           MÚSICA Y CD

           Siempre se buscan en red
           para evitar versiones viejas.
        */

        if (
            url.pathname.endsWith(
                "/musica1.mp3"
            ) ||
            url.pathname.endsWith(
                "/musica2.mp3"
            ) ||
            url.pathname.endsWith(
                "/cd1.png"
            ) ||
            url.pathname.endsWith(
                "/cd2.png"
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

                        return caches.match(
                            event.request
                        );

                    }
                )

            );

            return;

        }



        /*
           ARCHIVOS DE LA APP

           Primero intenta conseguir
           la versión actual.

           Si no hay Internet,
           utiliza la caché.
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