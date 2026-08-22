/* =====================================
   FECHAS
===================================== */


/*
   AQUÍ CAMBIAS LA FECHA
   EN LA QUE SE ABRIRÁ LA CARTA.

   Formato:

   AÑO-MES-DÍA HORA:MINUTOS

   Ejemplo:

   25 de agosto de 2026
   a las 10:00 AM

   sería:

   2026-08-25T10:00:00
*/

const FECHA_APERTURA =
    "2026-08-25T10:00:00";



/*
   AQUÍ PONES CUÁNDO APARECERÁ
   EL SIGUIENTE CONTADOR DESPUÉS
   DE QUE ELLA ABRA LA CARTA.

   Puedes cambiarlo cuando quieras.

   Ejemplo:

   15 de septiembre de 2026
   a las 10:00 AM
*/

const FECHA_SIGUIENTE =
    "2026-09-17T10:00:00";



/* =====================================
   DETECTAR SI ESTÁ EN LA APP
===================================== */

function estaEnLaApp() {

    const modoStandalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;


    const modoIOS =
        window.navigator.standalone === true;


    return
        modoStandalone ||
        modoIOS;
}


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



/* =====================================
   ESTADO
===================================== */

let cartaAbierta = false;


let cartaYaFueAbierta =
    localStorage.getItem(
        "cartaYaFueAbierta"
    ) === "true";



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
            (totalSegundos % 86400)
            / 3600
        );


    const minutosRestantes =
        Math.floor(
            (totalSegundos % 3600)
            / 60
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
   COMPROBAR ESTADO
===================================== */

function comprobarEstado() {

    const ahora =
        Date.now();



    /* ================================
       DESPUÉS DE ABRIR LA CARTA
    ================================= */

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



    /* ================================
       PRIMERA CARTA
    ================================= */

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
   ABRIR SOBRE
===================================== */

sobre.addEventListener(
    "click",
    function() {


        if (cartaAbierta) {
            return;
        }


        cartaAbierta = true;


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


    /*
       PRIMERO decidimos qué pantalla
       debe existir.

       Mientras tanto el body está
       invisible gracias a .cargando.
    */


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



    /*
       AHORA sí mostramos la página.

       Esto evita el parpadeo.
    */

    document.body.classList.remove(
        "cargando"
    );

}



/* =====================================
   INICIAR
===================================== */

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
    "serviceWorker"
    in navigator
) {


    window.addEventListener(
        "load",
        function() {


            navigator.serviceWorker.register(
                "sw.js"
            );


        }
    );

}