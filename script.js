javascript
/* =====================================
   FECHAS
===================================== */

/*
   PRIMERA CARTA
   25 de agosto de 2026
   10:00 AM México UTC-6
*/

const FECHA_APERTURA =
    "2026-08-22T14:50:00-06:00";


/*
   SEGUNDA CARTA
   17 de septiembre de 2026
   10:00 AM México UTC-6
*/

const FECHA_SIGUIENTE =
    "2026-09-17T10:00:00-06:00";



/* =====================================
   ELEMENTOS
===================================== */

const pantallaNavegador =
    document.getElementById(
        "pantallaNavegador"
    );


const pantallaCarga =
    document.getElementById(
        "pantallaCarga"
    );


const pantallaSobre =
    document.getElementById(
        "pantallaSobre"
    );


const pantallaCarta =
    document.getElementById(
        "pantallaCarta"
    );


const sobre =
    document.getElementById(
        "sobre"
    );


const zonaSobre =
    document.getElementById(
        "zonaSobre"
    );


const contador =
    document.getElementById(
        "contador"
    );


const volver =
    document.getElementById(
        "volver"
    );


const dias =
    document.getElementById(
        "dias"
    );


const horas =
    document.getElementById(
        "horas"
    );


const minutos =
    document.getElementById(
        "minutos"
    );


const segundos =
    document.getElementById(
        "segundos"
    );


const botonInstalar =
    document.getElementById(
        "botonInstalar"
    );


const imagenCarta =
    document.getElementById(
        "imagenCarta"
    );


const mensajeCartaError =
    document.getElementById(
        "mensajeCartaError"
    );


const barraProgreso =
    document.getElementById(
        "barraProgreso"
    );


const porcentajeCarga =
    document.getElementById(
        "porcentajeCarga"
    );


const musicaTemporizador =
    document.getElementById(
        "musicaTemporizador"
    );


const musicaCarta =
    document.getElementById(
        "musicaCarta"
    );


const cdMusica =
    document.getElementById(
        "cdMusica"
    );


const cdCarta =
    document.getElementById(
        "cdCarta"
    );



/* =====================================
   ESTADO
===================================== */

let cartaAbierta = false;


let cartaYaFueAbierta =
    localStorage.getItem(
        "cartaYaFueAbierta"
    ) === "true";


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


        /*
           IMPORTANTE:
           Esto solamente ocurre
           en la página de Google.
        */

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
                await eventoInstalacion
                    .userChoice;


            if (
                resultado.outcome ===
                "accepted"
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



function reproducirMusicaTemporizador() {

    if (!estaEnLaApp()) {
        return;
    }


    if (!musicaTemporizador) {
        return;
    }


    musicaCarta.pause();


    musicaTemporizador.play()
        .catch(
            () => {

                /*
                   Algunos navegadores bloquean
                   el autoplay hasta que el usuario
                   toca la pantalla.

                   Por eso también se intenta
                   desbloquear abajo.
                */

            }
        );

}



function reproducirMusicaCarta() {

    if (!estaEnLaApp()) {
        return;
    }


    if (!musicaCarta) {
        return;
    }


    musicaTemporizador.pause();


    musicaCarta.currentTime = 0;


    musicaCarta.play()
        .catch(
            () => {

            }
        );

}



/* =====================================
   DESBLOQUEAR AUDIO
===================================== */

document.addEventListener(
    "pointerdown",
    function() {

        if (!estaEnLaApp()) {
            return;
        }


        if (
            pantallaCarta &&
            !pantallaCarta.classList.contains(
                "oculto"
            )
        ) {

            reproducirMusicaCarta();

        }

        else {

            reproducirMusicaTemporizador();

        }

    },
    {
        once: true
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
            (totalSegundos % 86400) /
            3600
        );


    const minutosRestantes =
        Math.floor(
            (totalSegundos % 3600) /
            60
        );


    const segundosRestantes =
        totalSegundos % 60;


    dias.textContent =
        String(
            diasRestantes
        ).padStart(
            2,
            "0"
        );


    horas.textContent =
        String(
            horasRestantes
        ).padStart(
            2,
            "0"
        );


    minutos.textContent =
        String(
            minutosRestantes
        ).padStart(
            2,
            "0"
        );


    segundos.textContent =
        String(
            segundosRestantes
        ).padStart(
            2,
            "0"
        );

}



/* =====================================
   ESTADO PRINCIPAL
===================================== */

async function comprobarEstado() {

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
       SI LA CARTA YA FUE ABIERTA
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
       SI LA CARTA YA FUE ABIERTA
       PERO TODAVÍA NO LLEGA
       LA SEGUNDA FECHA
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
       PRIMER TEMPORIZADOR

       Esto evita que entre directamente
       al segundo temporizador solamente
       por haber quedado guardado un dato.
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
   COMPROBAR CARTA
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


            /*
               No se abre la pantalla de carta
               hasta comprobar que realmente
               existe carta.png.
            */

            const hayCarta =
                await existeCarta();


            if (!hayCarta) {

                /*
                   Si no hay carta,
                   NO muestra una pantalla vacía.

                   Regresa al primer temporizador.
                */

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

       Solo muestra "ola".

       NO carga la pantalla de carga.
       NO muestra música.
       NO muestra el temporizador.
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


        return;

    }



    /*
       APP:

       Primero carga 0% → 100%.
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
                .register(
                    "sw.js"
                )
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