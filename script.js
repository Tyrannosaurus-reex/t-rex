javascript
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

const pantallaCarga =
    document.getElementById("pantallaCarga");

const progresoCarga =
    document.getElementById("progresoCarga");

const porcentajeCarga =
    document.getElementById("porcentajeCarga");


const pantallaNavegador =
    document.getElementById("pantallaNavegador");


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
    document.getElementById(
        "mensajeCartaError"
    );


const musica1 =
    document.getElementById("musica1");


const musica2 =
    document.getElementById("musica2");


const reproductorMusica =
    document.getElementById(
        "reproductorMusica"
    );


const imagenCD =
    document.getElementById("imagenCD");



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

    const android =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;


    const ios =
        window.navigator.standalone === true;


    return android || ios;

}



/* =====================================
   MÚSICA
===================================== */

function detenerMusica() {

    if (musica1) {

        musica1.pause();

    }


    if (musica2) {

        musica2.pause();

    }

}


function mostrarCD(numero) {

    if (!estaEnLaApp()) {
        return;
    }


    if (!imagenCD ||
        !reproductorMusica) {

        return;

    }


    if (numero === 1) {

        imagenCD.src =
            "cd1.png";

    }

    else {

        imagenCD.src =
            "cd2.png";

    }


    reproductorMusica.classList.remove(
        "oculto"
    );

}


function musicaTemporizador() {

    if (!estaEnLaApp()) {
        return;
    }


    mostrarCD(1);


    if (musica2) {

        musica2.pause();

        musica2.currentTime = 0;

    }


    if (musica1) {

        musica1.volume = 0.75;

        musica1.play()
            .catch(
                () => {}
            );

    }

}


function musicaCarta() {

    if (!estaEnLaApp()) {
        return;
    }


    mostrarCD(2);


    if (musica1) {

        musica1.pause();

        musica1.currentTime = 0;

    }


    if (musica2) {

        musica2.volume = 0.75;

        musica2.play()
            .catch(
                () => {}
            );

    }

}



/* =====================================
   ACTIVAR MÚSICA CON LA PRIMERA
   INTERACCIÓN DENTRO DE LA APP
===================================== */

function activarMusicaApp() {

    if (!estaEnLaApp()) {
        return;
    }


    if (cartaAbierta) {

        musicaCarta();

    }

    else {

        musicaTemporizador();

    }

}


document.addEventListener(
    "click",
    activarMusicaApp,
    {
        once: true
    }
);



/* =====================================
   INSTALACIÓN
===================================== */

window.addEventListener(
    "beforeinstallprompt",
    evento => {

        evento.preventDefault();

        eventoInstalacion =
            evento;


        if (botonInstalar) {

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
   ESTADO DE LA APP
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



    /* =================================
       PRIMERA CARTA
    ================================= */

    if (!cartaYaFueAbierta) {


        /* ANTES DEL 25 DE AGOSTO */

        if (ahora < apertura) {

            zonaSobre.style.display =
                "none";


            contador.classList.remove(
                "oculto"
            );


            actualizarContador(
                FECHA_APERTURA
            );


            mostrarCD(1);


            return;

        }


        /* DESPUÉS DEL 25 DE AGOSTO */

        zonaSobre.style.display =
            "flex";


        contador.classList.add(
            "oculto"
        );


        mostrarCD(1);


        return;

    }



    /* =================================
       SEGUNDO TEMPORIZADOR
    ================================= */

    if (ahora < siguiente) {

        zonaSobre.style.display =
            "none";


        contador.classList.remove(
            "oculto"
        );


        actualizarContador(
            FECHA_SIGUIENTE
        );


        mostrarCD(1);


        return;

    }



    /* =================================
       SEGUNDO SOBRE
    ================================= */

    zonaSobre.style.display =
        "flex";


    contador.classList.add(
        "oculto"
    );


    mostrarCD(1);

}



/* =====================================
   COMPROBAR CARTA
===================================== */

function comprobarCarta() {

    imagenCarta.style.display =
        "none";


    mensajeCartaError.style.display =
        "none";


    imagenCarta.onload =
        function() {

            imagenCarta.style.display =
                "block";

            mensajeCartaError.style.display =
                "none";

        };


    imagenCarta.onerror =
        function() {

            imagenCarta.style.display =
                "none";

            mensajeCartaError.style.display =
                "block";

        };


    imagenCarta.src =
        "carta.png?v=" +
        Date.now();

}



/* =====================================
   ABRIR SOBRE
===================================== */

sobre.addEventListener(
    "click",
    function() {

        cartaAbierta = true;


        comprobarCarta();


        sobre.classList.add(
            "abriendo"
        );


        musicaCarta();


        setTimeout(
            function() {

                pantallaCarta.classList.remove(
                    "oculto"
                );

            },
            900
        );

    }
);



/* =====================================
   VOLVER
===================================== */

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


        musicaTemporizador();


        comprobarEstado();

    }
);



/* =====================================
   CARGA 0% → 100%
===================================== */

function cargarApp() {

    return new Promise(
        resolve => {

            let progreso = 0;


            const intervalo =
                setInterval(
                    function() {

                        progreso++;


                        if (
                            progreso > 100
                        ) {

                            progreso = 100;

                        }


                        progresoCarga.style.width =
                            progreso + "%";


                        porcentajeCarga.textContent =
                            progreso + "%";


                        if (
                            progreso === 100
                        ) {

                            clearInterval(
                                intervalo
                            );


                            setTimeout(
                                resolve,
                                500
                            );

                        }

                    },
                    20
                );

        }
    );

}



/* =====================================
   INICIAR
===================================== */

async function iniciar() {

    await cargarApp();


    pantallaCarga.style.display =
        "none";


    /*
       GOOGLE:
       solo "ola".
       Nada de música.
       Nada de CD.
       Nada del temporizador.
    */

    if (!estaEnLaApp()) {

        pantallaNavegador.classList.remove(
            "oculto"
        );


        pantallaSobre.classList.add(
            "oculto"
        );


        pantallaCarta.classList.add(
            "oculto"
        );


        reproductorMusica.classList.add(
            "oculto"
        );


        detenerMusica();


        document.body.classList.remove(
            "cargando"
        );


        return;

    }



    /*
       APP:
       entra al sistema normal.
    */

    pantallaNavegador.classList.add(
        "oculto"
    );


    pantallaSobre.classList.remove(
        "oculto"
    );


    pantallaCarta.classList.add(
        "oculto"
    );


    comprobarEstado();


    document.body.classList.remove(
        "cargando"
    );

}


iniciar();



/* =====================================
   ACTUALIZAR CADA SEGUNDO
===================================== */

setInterval(
    function() {

        if (estaEnLaApp()) {

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
                            () => {

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
