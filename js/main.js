document.addEventListener("DOMContentLoaded", async function() {
    const seccionBienvenida = document.getElementById('seccion-bienvenida');
    const seccionCategoria = document.getElementById('seccion-categoria');
    const seccionPregunta = document.getElementById('seccion-pregunta');
    const seccionResultado = document.getElementById('seccion-resultado');

    seccionBienvenida.style.display = 'none';
    seccionCategoria.style.display = 'none';
    seccionPregunta.style.display = 'none';
    seccionResultado.style.display = 'none';

    await swal({
        title: "Bienvenido a MusiQ Trivia!",
        text: "¿Estás listo para poner a prueba tus conocimientos musicales?",
        icon: "info",
        button: "Empezar a jugar",
    });

    seccionBienvenida.style.display = 'flex';

    const cuerpo = document.body;
    const botonModoColor = document.querySelector('#modo-color');
    const iconoModo = document.querySelector('#icono-modo');
    const inputNombreJugador = document.querySelector('#nombre-jugador');
    const botonIniciarJuego = document.querySelector('#iniciar-juego');
    const seleccionCategoria = document.querySelector('#categoria');
    const botonElegirCategoria = document.querySelector('#elegir-categoria');
    const textoPregunta = document.querySelector('#pregunta');
    const divOpciones = document.querySelector('#opciones');
    const textoResultado = document.querySelector('#resultado');

    let preguntas = [];
    let preguntasFiltradas = [];
    let indicePreguntaActual = 0;
    let totalPreguntasRespondidas = 0;
    let puntaje = 0;
    const maxPreguntas = 10;

    botonModoColor.addEventListener("click", toggleDarkMode);
    botonIniciarJuego.addEventListener("click", iniciarJuego);
    botonElegirCategoria.addEventListener("click", elegirCategoria);

    function toggleDarkMode() {
        cuerpo.classList.toggle('modo-oscuro');
        iconoModo.textContent = cuerpo.classList.contains('modo-oscuro') ? '🌜' : '🌞';
    }

    async function iniciarJuego() {
        let nombreJugador = inputNombreJugador.value.trim();
        if (nombreJugador) {
            await cargarPreguntas();
            toggleDisplay(seccionBienvenida, seccionCategoria);
        } else {
            await manejarError("Por favor, ingresa un nombre para empezar el juego.");
        }
    }

    async function cargarPreguntas() {
        try {
            const response = await fetch('preguntas.json');
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            preguntas = await response.json();
            console.log("Preguntas cargadas:", preguntas);
        } catch (error) {
            console.error(error);
            await manejarError("Error al cargar las preguntas. Por favor, intenta de nuevo.");
        }
    }

    function mostrarSeccionCategoria() {
        seccionBienvenida.style.display = 'none';
        seccionCategoria.style.display = 'block';
        seccionPregunta.style.display = 'none';
        seccionResultado.style.display = 'none';
        textoPregunta.textContent = '';
        divOpciones.innerHTML = '';
        textoResultado.textContent = '';
    }

    async function elegirCategoria() {
        let categoria = seleccionCategoria.value;
        console.log("Categoría seleccionada:", categoria); // Log para verificar la categoría seleccionada
        if (categoria) {
            preguntasFiltradas = obtenerPreguntasPorCategoria(categoria);
            console.log("Preguntas filtradas:", preguntasFiltradas); // Log para verificar las preguntas filtradas
            if (preguntasFiltradas.length > 0) {
                localStorage.setItem('preguntasFiltradas', JSON.stringify(preguntasFiltradas));
                indicePreguntaActual = 0;
                localStorage.setItem('indicePreguntaActual', indicePreguntaActual.toString());
                mostrarPregunta(preguntasFiltradas[indicePreguntaActual]);
                toggleDisplay(seccionCategoria, seccionPregunta);
            } else {
                await manejarError("No hay preguntas disponibles para esta categoría.");
            }
        } else {
            await manejarError("Debes seleccionar una categoría para continuar.");
        }
    }

    async function siguientePregunta() {
        indicePreguntaActual++;
        totalPreguntasRespondidas++;
        if (indicePreguntaActual < preguntasFiltradas.length) {
            mostrarPregunta(preguntasFiltradas[indicePreguntaActual]);
            localStorage.setItem('indicePreguntaActual', indicePreguntaActual.toString());
        } else {
            await revisarFinDelJuego();
        }
    }

    function mostrarPregunta(preguntaObjeto) {
        console.log("Mostrando pregunta:", preguntaObjeto);
        actualizarTextoPregunta(preguntaObjeto.pregunta);
        actualizarOpciones(preguntaObjeto.opciones, preguntaObjeto.respuestaCorrecta);
    }

    function actualizarTextoPregunta(texto) {
        textoPregunta.textContent = texto;
    }

    function actualizarOpciones(opciones, respuestaCorrecta) {
        divOpciones.innerHTML = '';
        opciones.forEach(opcion => {
            let botonOpcion = document.createElement('button');
            botonOpcion.textContent = opcion;
            botonOpcion.classList.add('opcion');
            botonOpcion.onclick = () => verificarRespuesta(opcion, respuestaCorrecta);
            divOpciones.appendChild(botonOpcion);
        });
    }

    async function verificarRespuesta(opcionSeleccionada, respuestaCorrecta) {
        if (opcionSeleccionada.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase()) {
            puntaje++;
            const value = await swal({
                title: "¡Correcto!",
                icon: "success",
                buttons: {
                    next: {
                        text: "Siguiente Pregunta",
                        value: "next",
                    }
                }
            });
            if (value === "next") {
                siguientePregunta();
            }
        } else {
            const value = await swal({
                title: `Incorrecto. La respuesta correcta es: ${respuestaCorrecta}.`,
                icon: "error",
                buttons: {
                    next: {
                        text: "Siguiente Pregunta",
                        value: "next",
                    }
                }
            });
            if (value === "next") {
                siguientePregunta();
            }
        }
    }

    function obtenerPreguntasPorCategoria(categoria) {
        const preguntasFiltradas = preguntas.filter(pregunta => pregunta.categoria === categoria);
        console.log(`Preguntas obtenidas para la categoría "${categoria}":`, preguntasFiltradas);
        return preguntasFiltradas;
    }

    async function manejarError(mensaje) {
        await swal("Error", mensaje, "error");
    }

    async function revisarFinDelJuego() {
        if (totalPreguntasRespondidas >= maxPreguntas) {
            await swal({
                title: "¡Fin del Juego!",
                text: `Tu puntaje es ${puntaje} de ${totalPreguntasRespondidas}.`,
                icon: "success",
                buttons: {
                    restart: {
                        text: "Jugar de nuevo",
                        value: "restart",
                    }
                }
            }).then((value) => {
                if (value === "restart") {
                    reiniciarJuego();
                }
            });
        } else {
            await swal({
                title: "¡Has completado todas las preguntas de esta categoría!",
                icon: "info",
                buttons: {
                    next: {
                        text: "Mostrar Categorías",
                        value: "next",
                    }
                }
            }).then((value) => {
                if (value === "next") {
                    mostrarSeccionCategoria();
                }
            });
        }
    }

    function reiniciarJuego() {
        puntaje = 0;
        totalPreguntasRespondidas = 0;
        indicePreguntaActual = 0;
        preguntasFiltradas = [];
        localStorage.removeItem('preguntasFiltradas');
        localStorage.removeItem('indicePreguntaActual');
        seccionBienvenida.style.display = 'flex';
        seccionCategoria.style.display = 'none';
        seccionPregunta.style.display = 'none';
        seccionResultado.style.display = 'none';
    }

    function toggleDisplay(elementoParaOcultar, elementoParaMostrar) {
        elementoParaOcultar.style.display = 'none';
        elementoParaMostrar.style.display = 'block';
    }
});
