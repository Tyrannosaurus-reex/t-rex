/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-22T14:20:00-06:00";


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
    document.getElementById(
        "pantallaNavegador"
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


/* =====================================
   ELEMENTOS DE MÚSICA
===================================== */

const musica1 =
    document.getElementById(
        "musica1"
    );


const musica2 =
    document.getElementById(
        "musica2"
    );


const reproductorMusica =
    document.getElementById(
        "reproductorMusica"
    );


const imagenCD =
    document.getElementById(
        "imagenCD"
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
   MÚSICA
===================================== */

function detenerMusicas() {

    if (musica1) {

        musica1.pause();

    }


    if (musica2) {

        musica2.pause();

    }

}


function mostrarCD(numero) {

    if (
        !imagenCD ||
        !reproductorMusica
    ) {
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


function reproducirMusica1() {

    if (!estaEnLaApp()) {
        return;
    }


    if (!musica1) {
        return;
    }


    if (musica2) {

        musica2.pause();
        musica2.currentTime = 0;

    }


    musica1.volume = 0.75;


    musica1.play()
        .catch(
            error => {

                console.log(
                    "La música necesita una interacción del usuario:",
                    error
                );

            }
        );


    mostrarCD(1);

}


function reproducirMusica2() {

    if (!estaEnLaApp()) {
        return;
    }


    if (!musica2) {
        return;
    }


    if (musica1) {

        musica1.pause();
        musica1.currentTime = 0;

    }


    musica2.volume = 0.75;


    musica2.play()
        .catch(
            error => {

                console.log(
                    "La música necesita una interacción del usuario:",
                    error
                );

            }
        );


    mostrarCD(2);

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
                await eventoInstalacion.userChoice;


            if (
                resultado.outcome ===
                "accepted"
            ) {

                botonInstalar.style.display =
                    "none";

            }


            eventoInstalacion =
                null;

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
       PRIMERA CARTA
    */

    if (!cartaYaFueAbierta) {


        /*
           Antes de la fecha:
           PRIMER TEMPORIZADOR
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


            if (estaEnLaApp()) {

                reproducirMusica1();

            }


            return;

        }



        /*
           Llegó la fecha:
           SOBRE
        */

        zonaSobre.style.display =
            "flex";


        contador.classList.add(
            "oculto"
        );


        if (estaEnLaApp()) {

            reproducirMusica1();

        }


        return;

    }



    /*
       PRIMERA CARTA YA ABIERTA
    */

    if (ahora < siguiente) {


        /*
           SEGUNDO TEMPORIZADOR
        */

        zonaSobre.style.display =
            "none";


        contador.classList.remove(
            "oculto"
        );


        actualizarContador(
            FECHA_SIGUIENTE
        );


        if (estaEnLaApp()) {

            reproducirMusica1();

        }


        return;

    }



    /*
       SIGUIENTE CARTA
    */

    zonaSobre.style.display =
        "flex";


    contador.classList.add(
        "oculto"
    );


    if (estaEnLaApp()) {

        reproducirMusica1();

    }

}



/* =====================================
   COMPROBAR CARTA
===================================== */

function comprobarCarta() {

    if (!imagenCarta) {
        return;
    }


    imagenCarta.style.display =
        "none";


    if (mensajeCartaError) {

        mensajeCartaError.style.display =
            "none";

    }


    const rutaCarta =
        "carta.png?v=" +
        Date.now();


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
        rutaCarta;

}



/* =====================================
   ABRIR SOBRE
===================================== */

sobre.addEventListener(
    "click",
    function() {

        if (cartaAbierta) {
            return;
        }


        cartaAbierta = true;


        comprobarCarta();


        sobre.classList.add(
            "abriendo"
        );


        /*
           Cambiar a la música 2
           cuando se abre la carta.
        */

        setTimeout(
            function() {

                reproducirMusica2();


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


        /*
           Regresa la música del
           temporizador.
        */

        reproducirMusica1();


        comprobarEstado();

    }
);



/* =====================================
   CARGA
===================================== */

function iniciarCarga() {

    return new Promise(
        resolve => {

            let progreso = 0;


            const intervalo =
                setInterval(
                    function() {

                        progreso += 1;


                        if (
                            progreso > 100
                        ) {

                            progreso =
                                100;

                        }


                        if (
                            progresoCarga
                        ) {

                            progresoCarga.style.width =
                                progreso + "%";

                        }


                        if (
                            porcentajeCarga
                        ) {

                            porcentajeCarga.textContent =
                                progreso + "%";

                        }


                        if (
                            progreso >= 100
                        ) {

                            clearInterval(
                                intervalo
                            );


                            setTimeout(
                                resolve,
                                700
                            );

                        }

                    },
                    25
                );

        }
    );

}



/* =====================================
   MOSTRAR PANTALLA CORRECTA
===================================== */

function mostrarPantallaCorrecta() {

    pantallaCarga.style.display =
        "none";


    /*
       SI NO ESTÁ INSTALADA:

       solo mostramos "ola".

       NO música.
       NO CD.
       NO temporizadores.
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


        detenerMusicas();


        document.body.classList.remove(
            "cargando"
        );


        return;

    }



    /*
       SI ESTÁ INSTALADA:

       mostramos la aplicación.
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


    /*
       Música solamente dentro
       de la aplicación.
    */

    reproducirMusica1();


    document.body.classList.remove(
        "cargando"
    );

}



/* =====================================
   INICIAR
===================================== */

async function iniciar() {

    await iniciarCarga();


    mostrarPantallaCorrecta();

}


iniciar();



/* =====================================
   ACTUALIZAR CONTADOR
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
                .register(
                    "sw.js"
                )
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