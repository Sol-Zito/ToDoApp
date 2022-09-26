const url = 'https://ctd-todo-api.herokuapp.com/v1'
const apiUrlTarea = `${url}/tasks`;

const jwt = localStorage.getItem("jwt");
if (!jwt) {
  alert('Usted no se encuentra logueado');
  location.replace("/index.html");
}


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  const btnCerrarSesion = document.getElementById('closeApp')
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */
  const nueva13 = localStorage.setItem('nuevo', 'nuevo13')
  btnCerrarSesion.addEventListener('click', function () {
    let cerrarSesion = confirm('Esta seguro de que quiere salir?')
    if (cerrarSesion) {
      localStorage.removeItem("jwt")
      location.replace("/index.html");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const api = `${url}/users/getMe`;

    const getting = {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        "Authorization": jwt
      }
    }

    fetch(api, getting)
      .then(response => response.json())
      .then(dataUsuario => {
        let resultado = dataUsuario
        const pNombre = document.querySelector('div.user-info p');
        pNombre.innerText = `${resultado.firstName} ${resultado.lastName}`;
      });
  }

  obtenerNombreUsuario()

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */


  function consultarTareas() {
    const getting = {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        "Authorization": jwt
      }
    }

    fetch(apiUrlTarea, getting)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.id - b.id)
        renderizarTareas(data)
      })

  }


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  const formCrearTarea = document.forms[0];
  const inputTarea = document.getElementById('nuevaTarea');

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault()
    if (inputTarea.value) {

      const infoTarea = {
        description: inputTarea.value,
        completed: false,
      }

      const configuracionTarea = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt,
        },
        body: JSON.stringify(infoTarea),
      }

      fetch(apiUrlTarea, configuracionTarea)
        .then(respuesta => respuesta.json())
        .then(data => {
          inputTarea.value = '';
          inputTarea.focus();
          mostrarNuevaTarea(data);
        })
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */

  function renderizarTareas(listado) {
    const { contenedorTareasPendientes, contenedorTareasTerminadas, cantFinalizadas } = obtenerContenedores();

    let tareasFinalizadas = 0;

    for (let i = 0; i < listado.length; i++) {
      const {
        contenedorTarea,
        description,
        tiempoCreacion,
        btnCambioEstado,
        btnBorrarTarea
      } = crearElementos(listado[i]);

      if (listado[i].completed) {
        tareasFinalizadas++;
        cantFinalizadas.innerText = tareasFinalizadas;
        contenedorTarea.classList.add('hecha');
        contenedorTareasTerminadas.appendChild(contenedorTarea);
        contenedorTarea.append(description, tiempoCreacion, btnBorrarTarea);

      } else {
        contenedorTarea.classList.add('incompleta');
        contenedorTareasPendientes.appendChild(contenedorTarea);
        contenedorTarea.append(description, tiempoCreacion, btnCambioEstado, btnBorrarTarea);
      }

    }
  }

  function mostrarNuevaTarea(tarea) {
    const contenedorTareasPendientes = document.getElementsByClassName('tareas-pendientes')[0];

    const {
      contenedorTarea,
      description,
      tiempoCreacion,
      btnCambioEstado,
      btnBorrarTarea
    } = crearElementos(tarea);

    contenedorTarea.classList.add('incompleta');
    contenedorTareasPendientes.appendChild(contenedorTarea);
    contenedorTarea.append(description, tiempoCreacion, btnCambioEstado, btnBorrarTarea);
  }

  function actualizarListados(tarea) {
    const { contenedorTareasPendientes, contenedorTareasTerminadas, cantFinalizadas } = obtenerContenedores();

    const elementoABorrar = contenedorTareasPendientes.querySelector(`#nro-${tarea.id}`);

    let tareasFinalizadas = +cantFinalizadas.innerText;

    const {
      contenedorTarea,
      description,
      tiempoCreacion,
      btnCambioEstado,
      btnBorrarTarea
    } = crearElementos(tarea);

    tareasFinalizadas++;
    cantFinalizadas.innerText = tareasFinalizadas;
    contenedorTarea.classList.add('hecha');
    contenedorTareasTerminadas.appendChild(contenedorTarea);
    contenedorTarea.append(description, tiempoCreacion, btnBorrarTarea);

    contenedorTareasPendientes.removeChild(elementoABorrar);
  }

  function crearElementos(item) {
    const fecha = new Date(item.createdAt);

    const contenedorTarea = document.createElement('li');
    contenedorTarea.classList.add('tarea');
    contenedorTarea.setAttribute('id', `nro-${item.id}`)

    const description = document.createElement('span');
    description.classList.add('descripcion')
    description.innerText = item.description;

    const tiempoCreacion = document.createElement('p');
    tiempoCreacion.classList.add('timestamp');
    tiempoCreacion.innerText = fecha.toLocaleDateString();

    const btnCambioEstado = document.createElement('button');
    btnCambioEstado.classList.add('cambios-estado');
    btnCambioEstado.innerText = 'Tarea realizada';
    btnCambioEstado.onclick = (event) => botonesCambioEstado(event);

    const btnBorrarTarea = document.createElement('button');
    btnBorrarTarea.classList.add('borrar');
    btnBorrarTarea.innerText = 'Borrar tarea';
    btnBorrarTarea.onclick = (event) => botonBorrarTarea(event);

    return {
      contenedorTarea,
      description,
      tiempoCreacion,
      btnCambioEstado,
      btnBorrarTarea
    }
  }

  function obtenerContenedores() {
    const contenedorTareasPendientes = document.getElementsByClassName('tareas-pendientes')[0];
    const contenedorTareasTerminadas = document.getElementsByClassName('tareas-terminadas')[0];
    const cantFinalizadas = document.getElementById('cantidad-finalizadas');

    return {
      contenedorTareasPendientes,
      contenedorTareasTerminadas,
      cantFinalizadas
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */


  function botonesCambioEstado(event) {

    const tareaRealizada = confirm('Esta tarea ya ha sido realizada?')
    if(tareaRealizada){

      const idTarea = event.target.parentNode.id.split('-')[1];
      const urlTasksId = apiUrlTarea + '/' + idTarea;
  
      const infoTarea = {
        completed: true,
      }
  
      const configuracionTarea = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt,
        },
        body: JSON.stringify(infoTarea),
      }
  
      fetch(urlTasksId, configuracionTarea)
        .then(response => response.json())
        .then(data => {
          actualizarListados(data);
        })
    }

  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(event) {
    let eliminarTarea = confirm('Desea eliminar la tarea?')

    if (eliminarTarea) {

      const idTarea = event.target.parentNode.id.split('-')[1];
      const elementoABorrarD = event.target.parentNode;

      const elementoContenedor = event.target.parentNode.parentNode;

      const urlTasksId = apiUrlTarea + '/' + idTarea;

      const configuracionTarea = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt,
        },
      }

      fetch(urlTasksId, configuracionTarea)
        .then(response => {
          elementoContenedor.removeChild(elementoABorrarD);
          if (elementoContenedor.classList.contains('tareas-terminadas')) {
            const cantFinalizadas = document.getElementById('cantidad-finalizadas');
            cantFinalizadas.innerText = elementoContenedor.childElementCount;
          }
          return response.json()

        })
        .then(data => {

          alert(data)
         
        })
    }

  }
});
