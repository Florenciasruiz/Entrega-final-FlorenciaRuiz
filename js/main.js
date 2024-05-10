document.addEventListener("DOMContentLoaded", function() {
    // Definición de preguntas en el ámbito global dentro de DOMContentLoaded
const preguntas = [
    {
        pregunta: "¿Quién es el líder de la banda británica Queen?",
        opciones: "a) Freddie Mercury\nb) John Lennon\nc) Mick Jagger\nd) Paul McCartney",
        respuestaCorrecta: "a",
        categoria: "historia"
    },
    {
        pregunta: "¿Quién es considerado el Rey del Rock and Roll?",
        opciones: "a) Bob Dylan\nb) Elvis Presley\nc) Chuck Berry\nd) Buddy Holly",
        respuestaCorrecta: "b",
        categoria: "cultura"
    },
    {
        pregunta: "¿Cuál es el festival de música más grande del mundo, que se celebra anualmente en California?",
        opciones: "a) Woodstock\nb) Lollapalooza\nc) Glastonbury\nd) Coachella",
        respuestaCorrecta: "d",
        categoria: "eventos"
    }
    ];

const cuerpo = document.body;
const botonModoColor = document.querySelector('#modo-color');
const iconoModo = document.querySelector('#icono-modo');
const inputNombreJugador = document.querySelector('#nombre-jugador');
const botonIniciarJuego = document.querySelector('#iniciar-juego');
const seleccionCategoria = document.querySelector('#categoria');
const botonElegirCategoria = document.querySelector('#elegir-categoria');
const textoPregunta = document.querySelector('#pregunta');
const divOpciones = document.querySelector('#opciones');
const seccionResultado = document.querySelector('#seccion-resultado');
const textoResultado = document.querySelector('#resultado');
const seccionBienvenida = document.querySelector('#seccion-bienvenida');
const seccionCategoria = document.querySelector('#seccion-categoria');
const seccionPregunta = document.querySelector('#seccion-pregunta');
const botonSiguiente = document.querySelector('#siguiente');

// Recuperación de datos del Storage y deserialización
const preguntasFiltradasGuardadas = JSON.parse(localStorage.getItem('preguntasFiltradas')) || [];
const indicePreguntaActualGuardado = parseInt(localStorage.getItem('indicePreguntaActual'), 10);

if (preguntasFiltradasGuardadas.length > 0 && indicePreguntaActualGuardado >= 0) {
    preguntasFiltradas = preguntasFiltradasGuardadas;
    indicePreguntaActual = indicePreguntaActualGuardado;
    mostrarPregunta(preguntasFiltradas[indicePreguntaActual]);
    toggleDisplay(seccionBienvenida, seccionPregunta);
}

botonSiguiente.addEventListener("click", siguientePregunta);
botonModoColor.addEventListener("click", toggleDarkMode);
botonIniciarJuego.addEventListener("click", iniciarJuego);
botonElegirCategoria.addEventListener("click", elegirCategoria);

function toggleDarkMode() {
    cuerpo.classList.toggle('modo-oscuro');
    iconoModo.textContent = cuerpo.classList.contains('modo-oscuro') ? '🌜' : '🌞';
}

function iniciarJuego() {
    let nombreJugador = inputNombreJugador.value.trim();
    if (nombreJugador) {
        toggleDisplay(seccionBienvenida, seccionCategoria);
    } else {
        alert("Por favor, ingresa un nombre para empezar el juego.");
    }
}


function elegirCategoria() {
    let categoria = seleccionCategoria.value;
    console.log("Categoría seleccionada:", categoria); 
    if (categoria) {
        preguntasFiltradas = obtenerPreguntasPorCategoria(categoria);
        console.log("Preguntas filtradas:", preguntasFiltradas); 
        if (preguntasFiltradas.length > 0) {
            localStorage.setItem('preguntasFiltradas', JSON.stringify(preguntasFiltradas));
            indicePreguntaActual = 0;
            localStorage.setItem('indicePreguntaActual', indicePreguntaActual.toString());
            mostrarPregunta(preguntasFiltradas[indicePreguntaActual]);
            toggleDisplay(seccionCategoria, seccionPregunta);
        } else {
            alert("No hay preguntas disponibles para esta categoría."); // Informar al usuario si no hay preguntas
        }
    } else {
        alert("Debes seleccionar una categoría para continuar.");
    }
}

function siguientePregunta() {
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntasFiltradas.length) {
        mostrarPregunta(preguntasFiltradas[indicePreguntaActual]);
        localStorage.setItem('indicePreguntaActual', indicePreguntaActual.toString());
    } else {
        alert("Has completado todas las preguntas de esta categoría. ¡Buen trabajo!");
        indicePreguntaActual = 0;
        toggleDisplay(seccionResultado, seccionCategoria);
    }
}

function mostrarPregunta(preguntaObjeto) {
    actualizarTextoPregunta(preguntaObjeto.pregunta);
    actualizarOpciones(preguntaObjeto.opciones, preguntaObjeto.respuestaCorrecta);
}

function actualizarTextoPregunta(texto) {
    textoPregunta.textContent = texto;
}

function actualizarOpciones(opciones, respuestaCorrecta) {
    divOpciones.innerHTML = '';
    opciones.split('\n').forEach(opcion => {
        let botonOpcion = document.createElement('button');
        botonOpcion.textContent = opcion;
        botonOpcion.classList.add('opcion');
        botonOpcion.onclick = () => verificarRespuesta(opcion.charAt(0), respuestaCorrecta);
        divOpciones.appendChild(botonOpcion);
    });
}

function verificarRespuesta(opcionSeleccionada, respuestaCorrecta) {
    if (opcionSeleccionada.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase()) {
        textoResultado.textContent = "¡Correcto!";
        textoResultado.style.color = "green";
    } else {
        textoResultado.textContent = `Incorrecto. La respuesta correcta es: ${respuestaCorrecta.toUpperCase()}.`;
        textoResultado.style.color = "red";
    }
    toggleDisplay(seccionPregunta, seccionResultado);
}

function toggleDisplay(elementoParaOcultar, elementoParaMostrar) {
    elementoParaOcultar.style.display = 'none';
    elementoParaMostrar.style.display = 'block';
}

function obtenerPreguntasPorCategoria(categoria) {
    return preguntas.filter(pregunta => pregunta.categoria === categoria);
}
});


