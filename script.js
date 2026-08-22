/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-22T11:55:00-06:00";


const FECHA_SIGUIENTE =
    "2026-09-15T10:00:00-06:00";



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
    document.getElementById("mensajeCartaError");



/* =====================================
   ESTADO
===================================== */

let cartaAbierta = false;


/*
   IMPORTANTE:

   Esto solamente cambia a true
   DESPUÉS de que el usuario abre
   la primera carta y pulsa "Volver".
*/

let cartaYaFueAbierta =
    localStorage.getItem(
        "cartaYaFueAbierta"
    ) === "true";



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
   INSTALACIÓN
===================================== */

let eventoInstalacion = null;


window.addEventListener(
    "beforeinstallprompt",
    evento => {

        evento.preventDefault();

        eventoInstalacion = evento;


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
       PRIMERA CARTA TODAVÍA NO ABIERTA
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

            return;
        }


        /*
           Ya llegó la fecha:
           SOBRE
        */

        zonaSobre.style.display =
            "flex";

        contador.classList.add(
            "oculto"
        );

        return;
    }



    /*
       PRIMERA CARTA YA FUE ABIERTA
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

        return;
    }



    /*
       YA LLEGÓ LA SIGUIENTE FECHA
       → SOBRE OTRA VEZ
    */

    zonaSobre.style.display =
        "flex";

    contador.classList.add(
        "oculto"
    );

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


    /*
       Se agrega una marca de tiempo
       para evitar que el navegador
       use una versión vieja.
    */

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


        /*
           AQUÍ es cuando realmente
           marcamos que la primera carta
           ya fue abierta.
        */

        cartaYaFueAbierta =
            true;


        localStorage.setItem(
            "cartaYaFueAbierta",
            "true"
        );


        comprobarEstado();

    }
);



/* =====================================
   CARGA 0% → 100%
===================================== */

function iniciarCarga() {

    return new Promise(
        resolve => {

            let progreso = 0;


            const intervalo =
                setInterval(
                    function() {

                        progreso += 1;


                        if (progreso > 100) {

                            progreso = 100;

                        }


                        progresoCarga.style.width =
                            progreso + "%";


                        porcentajeCarga.textContent =
                            progreso + "%";


                        if (progreso >= 100) {

                            clearInterval(
                                intervalo
                            );


                            /*
                               Pequeña pausa para
                               que el 100% realmente
                               se vea.
                            */

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


    if (estaEnLaApp()) {

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

    }

    else {

        pantallaNavegador.classList.remove(
            "oculto"
        );


        pantallaSobre.classList.add(
            "oculto"
        );


        pantallaCarta.classList.add(
            "oculto"
        );

    }


    document.body.classList.remove(
        "cargando"
    );

}



/* =====================================
   INICIAR
===================================== */

async function iniciar() {

    /*
       La carga SIEMPRE ocurre primero.
    */

    await iniciarCarga();


    /*
       Después de llegar al 100%,
       recién aquí se decide qué
       pantalla corresponde.
    */

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