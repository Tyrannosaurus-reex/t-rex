/* =========================================
   CONFIGURACIÓN DE LAS CARTAS
========================================= */

/*
   FECHA 1:
   CUÁNDO SE PUEDE ABRIR LA CARTA

   Ejemplo:
   22 de agosto de 2026 a las 10:00 AM

   2026-08-22T10:00:00
*/

const FECHA_APERTURA = "2026-08-25T10:00:00";


/*
   FECHA 2:
   CUÁNDO ESTARÁ DISPONIBLE LA SIGUIENTE CARTA

   Ejemplo:
   15 de septiembre de 2026 a las 10:00 AM

   2026-09-15T10:00:00
*/

const FECHA_SIGUIENTE = "2026-09-17T10:00:00";


/*
   NOMBRE DE LA CARTA
*/

const CARTA = "carta.png";


/* =========================================
   ELEMENTOS
========================================= */

const sobre = document.getElementById("sobre");

const zonaSobre =
    document.getElementById("zonaSobre");

const contador =
    document.getElementById("contador");

const pantallaCarta =
    document.getElementById("pantallaCarta");

const imagenCarta =
    document.getElementById("imagenCarta");

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


/* =========================================
   ESTADO
========================================= */

let cartaAbierta = false;

let cartaYaFueAbierta = false;


/*
   Revisamos si anteriormente
   ya se abrió la carta.

   Esto permite que después de darle
   "Volver" no vuelva a aparecer
   el sobre.
*/

if (localStorage.getItem("cartaYaFueAbierta") === "true") {

    cartaYaFueAbierta = true;

}


/* =========================================
   IMAGEN
========================================= */

imagenCarta.src = CARTA;


/* =========================================
   CONTADOR
========================================= */

function mostrarContador(tiempo) {

    contador.classList.remove("oculto");

    actualizarContador(tiempo);

}


function ocultarContador() {

    contador.classList.add("oculto");

}


/* =========================================
   ACTUALIZAR NÚMEROS
========================================= */

function actualizarContador(diferencia) {

    if (diferencia < 0) {

        diferencia = 0;

    }


    const segundosTotales =
        Math.floor(diferencia / 1000);


    const minutosTotales =
        Math.floor(segundosTotales / 60);


    const horasTotales =
        Math.floor(minutosTotales / 60);


    const d =
        Math.floor(horasTotales / 24);


    const h =
        horasTotales % 24;


    const m =
        minutosTotales % 60;


    const s =
        segundosTotales % 60;


    dias.textContent =
        String(d).padStart(2, "0");


    horas.textContent =
        String(h).padStart(2, "0");


    minutos.textContent =
        String(m).padStart(2, "0");


    segundos.textContent =
        String(s).padStart(2, "0");
}


/* =========================================
   COMPROBAR ESTADO
========================================= */

function comprobarEstado() {


    /*
       SI LA CARTA YA FUE ABIERTA
    */

    if (cartaYaFueAbierta) {


        const fechaSiguiente =
            new Date(FECHA_SIGUIENTE).getTime();


        const ahora =
            new Date().getTime();


        const diferencia =
            fechaSiguiente - ahora;


        /*
           Todavía no llega la siguiente carta
        */

        if (diferencia > 0) {

            zonaSobre.style.display = "none";

            mostrarContador(diferencia);

            return;

        }


        /*
           Ya llegó la siguiente fecha.
           Volvemos a mostrar el sobre.
        */

        zonaSobre.style.display = "block";

        ocultarContador();

        /*
           Permitimos abrir la siguiente carta
        */

        cartaYaFueAbierta = false;

        localStorage.removeItem("cartaYaFueAbierta");

        return;

    }


    /*
       SI LA CARTA TODAVÍA NO SE HA ABIERTO
    */

    const fechaApertura =
        new Date(FECHA_APERTURA).getTime();


    const ahora =
        new Date().getTime();


    const diferencia =
        fechaApertura - ahora;


    /*
       Todavía no llega la fecha
    */

    if (diferencia > 0) {

        zonaSobre.style.display = "none";

        mostrarContador(diferencia);

    }


    /*
       Ya llegó la fecha
    */

    else {

        zonaSobre.style.display = "block";

        ocultarContador();

    }

}


/* =========================================
   ABRIR SOBRE
========================================= */

sobre.addEventListener("click", () => {


    /*
       Evitar doble clic
    */

    if (cartaAbierta) {

        return;

    }


    cartaAbierta = true;


    /*
       Animación
    */

    sobre.classList.add("abriendo");


    /*
       Esperamos a que el sobre
       termine de abrirse
    */

    setTimeout(() => {

        pantallaCarta.classList.remove("oculto");

    }, 950);

});


/* =========================================
   VOLVER
========================================= */

volver.addEventListener("click", () => {


    /*
       Cerramos la pantalla de la carta
    */

    pantallaCarta.classList.add("oculto");


    /*
       Quitamos animación
    */

    sobre.classList.remove("abriendo");


    cartaAbierta = false;


    /*
       MARCAMOS LA CARTA COMO ABIERTA
    */

    cartaYaFueAbierta = true;


    localStorage.setItem(
        "cartaYaFueAbierta",
        "true"
    );


    /*
       Ahora empieza el segundo contador
    */

    comprobarEstado();

});


/* =========================================
   INICIAR
========================================= */

comprobarEstado();


/*
   Actualizar cada segundo
*/

setInterval(() => {

    comprobarEstado();

}, 1000);


/* =========================================
   APP
========================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js")

            .then(() => {

                console.log("App preparada.");

            })

            .catch((error) => {

                console.log(
                    "Error:",
                    error
                );

            });

    });

}