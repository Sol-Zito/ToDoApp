function mostrarSpinner() {
    // Seleccionamos el body. Esto nos servirá para incorporar nuestro spinner
    // dentro de nuestro HTML.
    const body = document.querySelector("body");

    // Seleccionamos el formulario de registro para poder ocultarlo durante la carga
    const form = document.querySelector("form");

    // Creamos nuestro spinner
    const spinnerContainer = document.createElement("div");
    const spinner = document.createElement("div");

    // Asignamos los IDs a cada nuevo elemento, para poder manipular
    // sus estilos
    spinnerContainer.setAttribute("id", "contenedor-carga");
    spinner.setAttribute("id", "carga");

    // Ocultamos el formulario de registro
    form.classList.add("hidden");

    // Agregamos el Spinner a nuestro HTML.
    spinnerContainer.appendChild(spinner);
    body.appendChild(spinnerContainer);

    return;
}

function ocultarSpinner() {
    // Seleccionamos el body para poder remover el spinner del HTML.
    const body = document.querySelector("body");

    // Seleccionamos el formulario de registro para poder mostrarlo nuevamente
    const form = document.querySelector("form");

    // Seleccionamos el spinner
    const spinnerContainer = document.querySelector("#contenedor-carga");

    // Removemos el spinner del HTML
    body.removeChild(spinnerContainer);

    // Quitamos la clase que oculta el formulario
    form.classList.remove("hidden");
    return;
}


form.addEventListener("submit", (e) => {
    // Esta función se ejecuta cuando se realiza el submit del formulario
    e.preventDefault();

    // Aquí podemos mostrar el spinner para indicar a la persona que se
    // ha iniciado el proceso de registro
    mostrarSpinner();

    // Realizamos algunas validaciones de los datos ingresados
    const nombreValido = validarNombre(nombre.value);
    const contrValido = validarContrasenia(
        contrasenia.value,
        repetirContrasenia.value
    );
    const emailValido = validarEmail(email.value);

    if (nombreValido && contrValido && emailValido) {
        const datosUsuario = new DatosUsuario();
        datosUsuario.setFirstname(nombre.value);
        datosUsuario.setLastname("DH");
        datosUsuario.setPassword(contrasenia.value);
        datosUsuario.setEmail(email.value);

        const url = "https://ctd-todo-api.herokuapp.com/v1";

        // Realizamos el llamado a la API
        fetch(`${url}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: datosUsuario.email,
                firstName: datosUsuario.firstName,
                lastName: datosUsuario.lastName,
                password: datosUsuario.password,
            }),
        })
            .then((datos) => {
                return datos.json();
            })
            .then((datos) => {
                localStorage.setItem("token", datos.jwt);
                // Una vez obtenida la respuesta de la API, ocultamos el spinner
                ocultarSpinner();
                location.href = "./lista-tareas.html";
            })
            .catch((err) => {
                console.log(err);
                // Ocultamos el spinner en caso de error
                ocultarSpinner();
            });
    } else {
        // Si alguno de los campos es incorrecto, ocultamos el spinner
        ocultarSpinner();
    }
});

window.onload = () => {
    renderizarSkeletons(5, ".tareas-pendientes");
};

function renderizarSkeletons(cantidad, contenedor) {
    // Seleccionamos el contenedor
    const contenedorTareas = document.querySelector(contenedor);

    // Creamos un array que tendrá un lenght igual a la cantidad de
    //skeletons que queremos renderizar
    const skeletons = Array.from({ length: cantidad });

    // Iteramos sobre el array accediendo a cada elemento
    skeletons.forEach(() => {
        // Guardamos el HTML de cada skeleton. Agregamos una clase con el selector del contenedor
        // Esto nos permitirá luego poder eliminar los skeletons de dicho contenedor
        const template = `
    <li class="skeleton-container ${contenedor.replace(".", "")}-child">
        <div class="skeleton-card">
        <p class="skeleton-text"></p>
        <p class="skeleton-text"></p>
        </div>
    </li>
    `;

        // Insertamos el HTML dentro del contenedor
        contenedorTareas.innerHTML += template;
    });
}


/* Esta función recibirá el nombre del contenedor dentro del cual
    se encuentran los skeletons que deseamos remover*/
function removerSkeleton(contenedor) {
    // Seleccionamos el contenedor
    const contenedorTareas = document.querySelector(contenedor);

    // Seleccionamos todos los skeletons dentro de ese contenedor
    const skeletons = document.querySelectorAll(`${contenedor}-child`);

    // Iteramos sobre la lista de skeletons y removemos cada uno de ellos
    // de dicho contenedor
    skeletons.forEach((skeleton) => contenedorTareas.removeChild(skeleton));
}