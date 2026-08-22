/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-25T10:00:00-06:00";


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
    localStorage.getItem(
        "cartaYaFueAbierta"
    ) === "true";


let eventoInstalacion = null;


let comprobandoCarta = false;



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
   EXISTE CARTA
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
                "carta.png?ver=" +
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


    if (musicaCarta) {
        musicaCarta.pause();
    }


    musicaTemporizador
        .play()
        .catch(() => {

            /*
               El navegador puede bloquear
               el autoplay.

               Se vuelve a intentar cuando
               haya una interacción.
            */

        });

}



function reproducirMusicaCarta() {

    if (!estaEnLaApp()) {
        return;
    }


    if (!musicaCarta) {
        return;
    }


    if (musicaTemporizador) {
        musicaTemporizador.pause();
    }


    musicaCarta
        .play()
        .catch(() => {

        });

}



/* =====================================
   ACTIVAR AUDIO AL TOCAR
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
        ).padStart(2, "0");


    horas.textContent =
        String(
            horasRestantes
        ).padStart(2, "0");


    minutos.textContent =
        String(
            minutosRestantes
        ).padStart(2, "0");


    segundos.textContent =
        String(
            segundosRestantes
        ).padStart(2, "0");

}



/* =====================================
   MOSTRAR PRIMER TEMPORIZADOR
===================================== */

function mostrarPrimerTemporizador() {

    zonaSobre.style.display =
        "none";


    contador.classList.remove(
        "oculto"
    );


    actualizarContador(
        FECHA_APERTURA
    );


    reproducirMusicaTemporizador();

}



/* =====================================
   MOSTRAR SEGUNDO TEMPORIZADOR
===================================== */

function mostrarSegundoTemporizador() {

    zonaSobre.style.display =
        "none";


    contador.classList.remove(
        "oculto"
    );


    actualizarContador(
        FECHA_SIGUIENTE
    );


    reproducirMusicaTemporizador();

}



/* =====================================
   MOSTRAR SOBRE
===================================== */

function mostrarSobre() {

    zonaSobre.style.display =
        "flex";


    contador.classList.add(
        "oculto"
    );


    reproducirMusicaTemporizador();

}



/* =====================================
   ESTADO PRINCIPAL
===================================== */

async function comprobarEstado() {

    if (!estaEnLaApp()) {
        return;
    }


    if (cartaAbierta) {
        return;
    }


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



    /* =================================
       ANTES DE LA PRIMERA FECHA

       SIEMPRE PRIMER TEMPORIZADOR.

       Aunque localStorage diga que
       alguna vez se abrió una carta.
    ================================= */

    if (ahora < apertura) {

        cartaYaFueAbierta = false;

        localStorage.removeItem(
            "cartaYaFueAbierta"
        );


        mostrarPrimerTemporizador();

        return;

    }



    /* =================================
       DESPUÉS DE LA PRIMERA FECHA
       
       PERO ANTES DE LA SEGUNDA.

       Aquí necesitamos comprobar
       que carta.png realmente exista.
    ================================= */

    if (ahora < siguiente) {

        if (!cartaYaFueAbierta) {

            if (!comprobandoCarta) {

                comprobandoCarta = true;


                const hayCarta =
                    await existeCarta();


                comprobandoCarta = false;


                if (hayCarta) {

                    mostrarSobre();

                }

                else {

                    /*
                       NO HAY CARTA.

                       No mostramos el sobre.
                       Nos quedamos en el
                       primer temporizador.
                    */

                    mostrarPrimerTemporizador();

                }

            }

            return;

        }



        /*
           Ya abrió la primera carta.
           Ahora corresponde el segundo
           temporizador.
        */

        mostrarSegundoTemporizador();

        return;

    }



    /* =================================
       YA LLEGÓ LA SEGUNDA FECHA
       
       Si ya había abierto la primera,
       comprobamos nuevamente la carta.
    ================================= */

    if (cartaYaFueAbierta) {

        if (!comprobandoCarta) {

            comprobandoCarta = true;


            const hayCarta =
                await existeCarta();


            comprobandoCarta = false;


            if (hayCarta) {

                mostrarSobre();

            }

            else {

                /*
                   Si todavía no existe
                   la carta nueva, mantenemos
                   el segundo temporizador
                   en 0.
                */

                mostrarSegundoTemporizador();

            }

        }

        return;

    }



    /*
       Si por alguna razón llegó
       la segunda fecha sin que
       se haya registrado la primera,
       comprobamos la carta.
    */

    if (!comprobandoCarta) {

        comprobandoCarta = true;


        const hayCarta =
            await existeCarta();


        comprobandoCarta = false;


        if (hayCarta) {

            mostrarSobre();

        }

        else {

            mostrarPrimerTemporizador();

        }

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


    imagenCarta.onload =
        function() {

            imagenCarta.style.display =
                "block";


            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "none";

            }

        };


    imagenCarta.onerror =
        function() {

            imagenCarta.style.display =
                "none";


            if (mensajeCartaError) {

                mensajeCartaError.style.display =
                    "block";

            }

        };


    imagenCarta.src =
        "carta.png?ver=" +
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
               Comprobamos carta.png
               ANTES de abrir el sobre.
            */

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


                /*
                   Si no hay carta,
                   volvemos al primer
                   temporizador.
                */

                mostrarPrimerTemporizador();

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
   VOLVER DE LA CARTA
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


            /*
               Ya se abrió la primera carta.
               Por eso ahora comienza
               el segundo temporizador.
            */

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


    barraProgreso.style.width =
        "0%";


    porcentajeCarga.textContent =
        "0%";


    /*
       Carga visual de 0 a 100.
    */

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
       NAVEGADOR

       Solo:
       ola :3
       Descargar

       Nada de carga.
       Nada de música.
       Nada de CD.
       Nada de temporizador.
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

       Empieza 0% → 100%.
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