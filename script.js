/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-22T19:27:00-06:00";

const FECHA_SIGUIENTE =
    "2026-09-17T10:00:00-06:00";


/* =====================================
   ELEMENTOS
===================================== */

const pantallaNavegador =
    document.getElementById("pantallaNavegador");

const pantallaCarga =
    document.getElementById("pantallaCarga");

const pantallaSobre =
    document.getElementById("pantallaSobre");

const pantallaCarta =
    document.getElementById("pantallaCarta");

const sobre =
    document.getElementById("sobre");

const zonaSobre =
    document.getElementById("zonaSobre");

const contador =
    document.getElementById("contador");

const volver =
    document.getElementById("volver");

const dias =
    document.getElementById("dias");

const horas =
    document.getElementById("horas");

const minutos =
    document.getElementById("minutos");

const segundos =
    document.getElementById("segundos");

const botonInstalar =
    document.getElementById("botonInstalar");

const imagenCarta =
    document.getElementById("imagenCarta");

const mensajeCartaError =
    document.getElementById("mensajeCartaError");

const barraProgreso =
    document.getElementById("barraProgreso");

const porcentajeCarga =
    document.getElementById("porcentajeCarga");

const musicaTemporizador =
    document.getElementById("musicaTemporizador");

const musicaCarta =
    document.getElementById("musicaCarta");

const cdMusica =
    document.getElementById("cdMusica");

const cdCarta =
    document.getElementById("cdCarta");


/* =====================================
   ESTADO
===================================== */

let cartaAbierta = false;

let cartaYaFueAbierta =
    localStorage.getItem("cartaYaFueAbierta") === "true";

let eventoInstalacion = null;

let appActiva = false;

let cartaCargada = false;


/* =====================================
   DETECTAR APP INSTALADA
===================================== */

function estaEnLaApp() {

    const standalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;

    const ios =
        window.navigator.standalone === true;

    return standalone || ios;
}


/* =====================================
   VISIBILIDAD DE LA APP
===================================== */

function actualizarEstadoApp() {

    /*
       La música solamente puede sonar
       mientras la aplicación instalada
       está realmente visible y activa.
    */

    appActiva =
        estaEnLaApp() &&
        document.visibilityState === "visible";


    if (!appActiva) {

        detenerMusica();

    }

}


/* =====================================
   CAMBIO DE VISIBILIDAD
===================================== */

document.addEventListener(
    "visibilitychange",
    function() {

        actualizarEstadoApp();

    }
);

window.addEventListener(
    "pagehide",
    function() {

        detenerMusica();

        appActiva = false;

    }
);

window.addEventListener(
    "blur",
    function() {

        if (document.visibilityState !== "visible") {

            detenerMusica();

        }

    }
);


/* =====================================
   INSTALACIÓN
===================================== */

window.addEventListener(
    "beforeinstallprompt",
    evento => {

        evento.preventDefault();

        eventoInstalacion = evento;

        if (
            !estaEnLaApp() &&
            botonInstalar
        ) {

            botonInstalar.style.display =
                "block";

        }

    }
);


if (botonInstalar) {

    botonInstalar.addEventListener(
        "click",
        async () => {

            if (!eventoInstalacion) {
                return;
            }

            eventoInstalacion.prompt();

            const resultado =
                await eventoInstalacion.userChoice;

            if (
                resultado.outcome === "accepted"
            ) {

                botonInstalar.style.display =
                    "none";

            }

            eventoInstalacion = null;

        }
    );

}


/* =====================================
   MÚSICA
===================================== */

function detenerMusica() {

    if (musicaTemporizador) {

        musicaTemporizador.pause();

        musicaTemporizador.currentTime = 0;

    }

    if (musicaCarta) {

        musicaCarta.pause();

        musicaCarta.currentTime = 0;

    }

}


/*
   La música del temporizador.
*/

function reproducirMusicaTemporizador() {

    actualizarEstadoApp();

    if (!appActiva) {
        return;
    }

    if (!musicaTemporizador) {
        return;
    }

    if (
        pantallaCarta &&
        !pantallaCarta.classList.contains("oculto")
    ) {

        return;

    }

    if (musicaCarta) {

        musicaCarta.pause();

    }

    musicaTemporizador
        .play()
        .catch(() => {});

}


/*
   La música de la carta.
*/

function reproducirMusicaCarta() {

    actualizarEstadoApp();

    if (!appActiva) {
        return;
    }

    if (!musicaCarta) {
        return;
    }

    if (musicaTemporizador) {

        musicaTemporizador.pause();

    }

    /*
       IMPORTANTE:

       NO ponemos currentTime = 0 aquí.

       Así, tocar la pantalla no reinicia
       la canción.
    */

    musicaCarta
        .play()
        .catch(() => {});

}


/* =====================================
   REPETIR MÚSICA AL TERMINAR
===================================== */

if (musicaTemporizador) {

    musicaTemporizador.addEventListener(
        "ended",
        function() {

            if (appActiva) {

                musicaTemporizador.currentTime = 0;

                musicaTemporizador
                    .play()
                    .catch(() => {});

            }

        }
    );

}


if (musicaCarta) {

    musicaCarta.addEventListener(
        "ended",
        function() {

            if (appActiva) {

                musicaCarta.currentTime = 0;

                musicaCarta
                    .play()
                    .catch(() => {});

            }

        }
    );

}


/* =====================================
   DESBLOQUEAR AUDIO
===================================== */

document.addEventListener(
    "pointerdown",
    function() {

        actualizarEstadoApp();

        if (!appActiva) {
            return;
        }

        /*
           Si la carta está abierta,
           solamente intenta continuar la
           canción actual.

           NO la reinicia.
        */

        if (
            pantallaCarta &&
            !pantallaCarta.classList.contains("oculto")
        ) {

            reproducirMusicaCarta();

        }

        else {

            reproducirMusicaTemporizador();

        }

    }
);


/* =====================================
   CONTADOR
===================================== */

function actualizarContador(fecha) {

    const ahora =
        Date.now();

    const destino =
        new Date(fecha).getTime();

    let diferencia =
        destino - ahora;

    if (diferencia < 0) {

        diferencia = 0;

    }

    const totalSegundos =
        Math.floor(
            diferencia / 1000
        );

    const diasRestantes =
        Math.floor(
            totalSegundos / 86400
        );

    const horasRestantes =
        Math.floor(
            (totalSegundos % 86400) / 3600
        );

    const minutosRestantes =
        Math.floor(
            (totalSegundos % 3600) / 60
        );

    const segundosRestantes =
        totalSegundos % 60;


    dias.textContent =
        String(diasRestantes)
            .padStart(2, "0");

    horas.textContent =
        String(horasRestantes)
            .padStart(2, "0");

    minutos.textContent =
        String(minutosRestantes)
            .padStart(2, "0");

    segundos.textContent =
        String(segundosRestantes)
            .padStart(2, "0");

}


/* =====================================
   ESTADO PRINCIPAL
===================================== */

function comprobarEstado() {

    const ahora =
        Date.now();

    const apertura =
        new Date(
            FECHA_APERTURA
        ).getTime();

    const siguiente =
        new Date(
            FECHA_SIGUIENTE
        ).getTime();


    /*
       YA SE ABRIÓ LA PRIMERA CARTA
       Y YA LLEGÓ LA SEGUNDA FECHA
    */

    if (
        cartaYaFueAbierta &&
        ahora >= siguiente
    ) {

        zonaSobre.style.display =
            "flex";

        contador.classList.add(
            "oculto"
        );

        reproducirMusicaTemporizador();

        return;

    }


    /*
       YA SE ABRIÓ LA PRIMERA CARTA
       PERO AÚN NO LLEGA LA SEGUNDA FECHA
    */

    if (
        cartaYaFueAbierta &&
        ahora < siguiente
    ) {

        zonaSobre.style.display =
            "none";

        contador.classList.remove(
            "oculto"
        );

        actualizarContador(
            FECHA_SIGUIENTE
        );

        reproducirMusicaTemporizador();

        return;

    }


    /*
       AÚN NO LLEGA LA PRIMERA FECHA
    */

    if (ahora < apertura) {

        zonaSobre.style.display =
            "none";

        contador.classList.remove(
            "oculto"
        );

        actualizarContador(
            FECHA_APERTURA
        );

        reproducirMusicaTemporizador();

        return;

    }


    /*
       YA LLEGÓ LA PRIMERA FECHA
    */

    zonaSobre.style.display =
        "flex";

    contador.classList.add(
        "oculto"
    );

    reproducirMusicaTemporizador();

}


/* =====================================
   PRE-CARGAR CARTA
===================================== */

function prepararCarta() {

    if (!imagenCarta) {
        return;
    }

    /*
       Si ya fue cargada correctamente,
       no volvemos a descargarla.
    */

    if (cartaCargada) {
        return;
    }

    imagenCarta.style.display =
        "block";

    if (mensajeCartaError) {

        mensajeCartaError.style.display =
            "none";

    }


    imagenCarta.onload =
        function() {

            cartaCargada = true;

            imagenCarta.style.display =
                "block";

            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "none";

            }

        };


    imagenCarta.onerror =
        function() {

            cartaCargada = false;

            imagenCarta.style.display =
                "none";

            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "block";

            }

        };


    /*
       SIN Date.now()

       Así evitamos que cada intento
       cree una URL diferente.
    */

    imagenCarta.src =
        "carta.png";

}


/* =====================================
   ABRIR SOBRE
===================================== */

if (sobre) {

    sobre.addEventListener(
        "click",
        function() {

            if (cartaAbierta) {
                return;
            }

            /*
               Si no existe la imagen,
               regresamos al temporizador.
            */

            if (!cartaCargada) {

                /*
                   Intentamos cargarla.
                */

                if (
                    imagenCarta &&
                    imagenCarta.complete &&
                    imagenCarta.naturalWidth > 0
                ) {

                    cartaCargada = true;

                }

                else {

                    /*
                       La imagen todavía no está
                       lista. La cargamos y esperamos
                       antes de abrir la carta.
                    */

                    prepararCarta();

                    return;

                }

            }


            /*
               AQUÍ SÍ EXISTE LA CARTA.
            */

            cartaAbierta = true;

            detenerMusica();


            sobre.classList.add(
                "abriendo"
            );


            /*
               Mostramos la carta DESPUÉS
               de que la animación del sobre
               termina.

               La imagen ya está cargada,
               por lo que no debería aparecer
               una pantalla vacía.
            */

            setTimeout(
                function() {

                    pantallaSobre.classList.add(
                        "oculto"
                    );

                    pantallaCarta.classList.remove(
                        "oculto"
                    );

                    reproducirMusicaCarta();

                },
                900
            );

        }
    );

}


/* =====================================
   PREPARAR CARTA AL CARGAR LA APP
===================================== */

function prepararCartaAlIniciar() {

    if (!estaEnLaApp()) {
        return;
    }

    /*
       Se empieza a cargar en segundo plano.

       Así cuando llegue el momento de abrirla,
       ya estará lista.
    */

    prepararCarta();

}


/* =====================================
   VOLVER
===================================== */

if (volver) {

    volver.addEventListener(
        "click",
        function() {

            pantallaCarta.classList.add(
                "oculto"
            );

            pantallaSobre.classList.remove(
                "oculto"
            );

            sobre.classList.remove(
                "abriendo"
            );

            cartaAbierta = false;

            cartaYaFueAbierta =
                true;

            localStorage.setItem(
                "cartaYaFueAbierta",
                "true"
            );

            detenerMusica();

            comprobarEstado();

        }
    );

}


/* =====================================
   CARGA DE LA APP
===================================== */

function iniciarCargaApp() {

    pantallaNavegador.classList.add(
        "oculto"
    );

    pantallaSobre.classList.add(
        "oculto"
    );

    pantallaCarta.classList.add(
        "oculto"
    );

    pantallaCarga.classList.remove(
        "oculto"
    );


    let progreso = 0;


    const intervalo =
        setInterval(
            function() {

                progreso += 1;

                if (progreso > 100) {

                    progreso = 100;

                }


                barraProgreso.style.width =
                    progreso + "%";

                porcentajeCarga.textContent =
                    progreso + "%";


                if (progreso >= 100) {

                    clearInterval(
                        intervalo
                    );


                    setTimeout(
                        function() {

                            pantallaCarga.classList.add(
                                "oculto"
                            );

                            pantallaSobre.classList.remove(
                                "oculto"
                            );

                            comprobarEstado();

                            /*
                               Comenzamos a cargar
                               carta.png en segundo plano.
                            */

                            prepararCartaAlIniciar();

                        },
                        250
                    );

                }

            },
            25
        );

}


/* =====================================
   INICIAR
===================================== */

function iniciar() {

    actualizarEstadoApp();


    /*
       NAVEGADOR

       Solo muestra "ola" y el botón
       de descargar.

       NO carga música.
       NO muestra temporizador.
       NO muestra carta.
    */

    if (!estaEnLaApp()) {

        pantallaNavegador.classList.remove(
            "oculto"
        );

        pantallaCarga.classList.add(
            "oculto"
        );

        pantallaSobre.classList.add(
            "oculto"
        );

        pantallaCarta.classList.add(
            "oculto"
        );

        detenerMusica();

        return;

    }


    /*
       APP INSTALADA
    */

    pantallaNavegador.classList.add(
        "oculto"
    );

    iniciarCargaApp();

}


iniciar();


/* =====================================
   ACTUALIZAR CADA SEGUNDO
===================================== */

setInterval(
    function() {

        actualizarEstadoApp();

        if (
            estaEnLaApp() &&
            pantallaCarta.classList.contains(
                "oculto"
            )
        ) {

            comprobarEstado();

        }

    },
    1000
);


/* =====================================
   SERVICE WORKER
===================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register("sw.js")
                .then(
                    registro => {

                        registro.update();

                        setInterval(
                            function() {

                                registro.update();

                            },
                            60000
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Error:",
                            error
                        );

                    }
                );

        }
    );

}