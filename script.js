/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-25T15:30:00-06:00";

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


/* =====================================
   DETECTAR APP
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
   APP EN PRIMER PLANO
===================================== */

function appEstaActiva() {

    return (
        estaEnLaApp() &&
        document.visibilityState === "visible" &&
        document.hasFocus()
    );
}


/* =====================================
   DETENER MÚSICA
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


/* =====================================
   REPRODUCIR MÚSICA DEL TEMPORIZADOR
===================================== */

function reproducirMusicaTemporizador() {

    if (!appEstaActiva()) {
        detenerMusica();
        return;
    }

    if (!musicaTemporizador) {
        return;
    }

    if (musicaCarta) {
        musicaCarta.pause();
        musicaCarta.currentTime = 0;
    }

    musicaTemporizador
        .play()
        .catch(() => {});
}


/* =====================================
   REPRODUCIR MÚSICA DE LA CARTA
===================================== */

function reproducirMusicaCarta() {

    if (!appEstaActiva()) {
        detenerMusica();
        return;
    }

    if (!musicaCarta) {
        return;
    }

    if (musicaTemporizador) {
        musicaTemporizador.pause();
        musicaTemporizador.currentTime = 0;
    }

    musicaCarta.currentTime = 0;

    musicaCarta
        .play()
        .catch(() => {});
}


/* =====================================
   CONTROLAR MÚSICA AL SALIR DE LA APP
===================================== */

/*
   Si se cambia de pestaña,
   se minimiza la ventana,
   se bloquea el celular,
   se sale de la app
   o deja de estar visible,
   la música se detiene.
*/

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState !== "visible"
        ) {

            detenerMusica();

        }

    }
);


/*
   También se detiene cuando
   la ventana pierde el foco.
*/

window.addEventListener(
    "blur",
    function() {

        detenerMusica();

    }
);


/*
   Cuando vuelve a tener foco,
   NO empieza automáticamente.

   Solo vuelve a reproducirse
   después de una interacción.
*/


/* =====================================
   DESBLOQUEAR AUDIO CON TOQUE
===================================== */

document.addEventListener(
    "pointerdown",
    function() {

        if (!appEstaActiva()) {
            return;
        }

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
   COMPROBAR SI EXISTE CARTA
===================================== */

function existeCarta() {

    return new Promise(
        resolve => {

            const imagen =
                new Image();

            imagen.onload =
                function() {

                    resolve(true);

                };

            imagen.onerror =
                function() {

                    resolve(false);

                };

            imagen.src =
                "carta.png?v=" +
                Date.now();

        }
    );
}


/* =====================================
   INSTALACIÓN
===================================== */

window.addEventListener(
    "beforeinstallprompt",
    evento => {

        evento.preventDefault();

        eventoInstalacion =
            evento;

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
        String(diasRestantes).padStart(2, "0");

    horas.textContent =
        String(horasRestantes).padStart(2, "0");

    minutos.textContent =
        String(minutosRestantes).padStart(2, "0");

    segundos.textContent =
        String(segundosRestantes).padStart(2, "0");
}


/* =====================================
   ESTADO PRINCIPAL
===================================== */

async function comprobarEstado() {

    if (!estaEnLaApp()) {
        detenerMusica();
        return;
    }

    const ahora =
        Date.now();

    const apertura =
        new Date(FECHA_APERTURA).getTime();

    const siguiente =
        new Date(FECHA_SIGUIENTE).getTime();


    /* ================================
       SEGUNDA FECHA
    ================================= */

    if (
        cartaYaFueAbierta &&
        ahora >= siguiente
    ) {

        zonaSobre.style.display =
            "flex";

        contador.classList.add(
            "oculto"
        );

        if (appEstaActiva()) {
            reproducirMusicaTemporizador();
        }

        return;
    }


    /* ================================
       ESPERANDO SEGUNDA CARTA
    ================================= */

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

        if (appEstaActiva()) {
            reproducirMusicaTemporizador();
        }

        return;
    }


    /* ================================
       PRIMER TEMPORIZADOR
    ================================= */

    if (ahora < apertura) {

        zonaSobre.style.display =
            "none";

        contador.classList.remove(
            "oculto"
        );

        actualizarContador(
            FECHA_APERTURA
        );

        if (appEstaActiva()) {
            reproducirMusicaTemporizador();
        }

        return;
    }


    /* ================================
       YA LLEGÓ LA PRIMERA FECHA
    ================================= */

    zonaSobre.style.display =
        "flex";

    contador.classList.add(
        "oculto"
    );

    if (appEstaActiva()) {
        reproducirMusicaTemporizador();
    }
}


/* =====================================
   MOSTRAR CARTA
===================================== */

function mostrarCarta() {

    if (!imagenCarta) {
        return;
    }

    imagenCarta.style.display =
        "block";

    if (mensajeCartaError) {

        mensajeCartaError.style.display =
            "none";

    }

    imagenCarta.onerror =
        function() {

            imagenCarta.style.display =
                "none";

            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "block";

            }

        };

    imagenCarta.onload =
        function() {

            imagenCarta.style.display =
                "block";

            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "none";

            }

        };

    imagenCarta.src =
        "carta.png?v=" +
        Date.now();
}


/* =====================================
   ABRIR SOBRE
===================================== */

if (sobre) {

    sobre.addEventListener(
        "click",
        async function() {

            if (cartaAbierta) {
                return;
            }

            const hayCarta =
                await existeCarta();

            if (!hayCarta) {

                cartaAbierta = false;

                sobre.classList.remove(
                    "abriendo"
                );

                pantallaCarta.classList.add(
                    "oculto"
                );

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


            cartaAbierta = true;

            detenerMusica();

            sobre.classList.add(
                "abriendo"
            );

            mostrarCarta();

            setTimeout(
                function() {

                    if (!appEstaActiva()) {
                        return;
                    }

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
   VOLVER
===================================== */

if (volver) {

    volver.addEventListener(
        "click",
        function() {

            pantallaCarta.classList.add(
                "oculto"
            );

            sobre.classList.remove(
                "abriendo"
            );

            cartaAbierta = false;

            cartaYaFueAbierta = true;

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

    /*
       NAVEGADOR:
       Solo muestra "ola"
       y el botón de descargar.
    */

    if (!estaEnLaApp()) {

        detenerMusica();

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

        return;
    }


    /*
       APP:
       Primero aparece la carga.
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

        if (!estaEnLaApp()) {
            detenerMusica();
            return;
        }

        if (
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

if ("serviceWorker" in navigator) {

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