/* =====================================
   FECHAS
===================================== */

const FECHA_APERTURA =
    "2026-08-22T11:11:00";


const FECHA_SIGUIENTE =
    "2026-09-15T10:00:00";



/* =====================================
   ELEMENTOS
===================================== */

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
   ESTADO
===================================== */

let cartaAbierta = false;


let cartaYaFueAbierta =
    localStorage.getItem(
        "cartaYaFueAbierta"
    ) === "true";



/* =====================================
   INSTALACIÓN
===================================== */

let eventoInstalacion = null;


window.addEventListener(
    "beforeinstallprompt",
    (evento) => {

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
   ESTADO DE LA PÁGINA
===================================== */

function comprobarEstado() {

    const ahora =
        Date.now();


    if (cartaYaFueAbierta) {

        const siguiente =
            new Date(
                FECHA_SIGUIENTE
            ).getTime();


        if (ahora < siguiente) {

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


        zonaSobre.style.display =
            "flex";


        contador.classList.add(
            "oculto"
        );


        cartaYaFueAbierta =
            false;


        localStorage.removeItem(
            "cartaYaFueAbierta"
        );


        return;
    }


    const apertura =
        new Date(
            FECHA_APERTURA
        ).getTime();


    if (ahora < apertura) {

        zonaSobre.style.display =
            "none";


        contador.classList.remove(
            "oculto"
        );


        actualizarContador(
            FECHA_APERTURA
        );

    }

    else {

        zonaSobre.style.display =
            "flex";


        contador.classList.add(
            "oculto"
        );

    }

}



/* =====================================
   COMPROBAR CARTA
===================================== */

function comprobarCarta() {

    if (!imagenCarta) {
        return;
    }


    /*
       Si carta.png existe,
       se muestra normalmente.

       Si no existe,
       aparece un mensaje en lugar
       de romper la página.
    */

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


    /*
       Esto fuerza al navegador a pedir
       la versión actual de la imagen.
       
       NO tienes que modificar este número
       cuando cambies la carta.
    */

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
   INICIAR
===================================== */

function iniciar() {

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