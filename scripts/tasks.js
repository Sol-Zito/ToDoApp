// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
// usamos el replace para no guardar en el historial la url anterior

const jwt = localStorage.getItem("jwt");
if (!jwt) {
  alert('Usted no se encuentra logueado');
  location.replace("/index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.getElementById('closeApp')


  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

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
    const api = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe'; 

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
        console.log('data del usuario', dataUsuario);
        let resultado = dataUsuario
        const nombreUsuario = resultado.firstName;
        const apellidoUsuario = resultado.lastName
        const pNombre = document.querySelector('div.user-info p'); 
        pNombre.innerText = `${nombreUsuario} ${apellidoUsuario}`;
      });

  }

  obtenerNombreUsuario()

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */
  
  const formCrearTarea = document.forms[0];
  const inputTarea = document.getElementById('nuevaTarea');
  let localTareas = 'tareas';
  let arrTareas = localStorage.getItem(localTareas) ? JSON.parse(localStorage.getItem(localTareas)) : [];

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault()
    const apiUrlTarea = 'https://ctd-todo-api.herokuapp.com/v1/tasks';

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
      .then( respuesta => respuesta.json())
      .then( data => {
        console.log('data de la tarea', data);
      })
      
      arrTareas.push(infoTarea.description);

      inputTarea.value = ''
    }

    localStorage.setItem(localTareas, JSON.stringify(arrTareas));
    
    renderizarTareas(arrTareas)
  });
  
  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  const contenedorTareas =  document.getElementsByClassName('tareas-pendientes')[0];
  
  if (arrTareas.length > 0) {
    arrTareas.forEach(el => {
      addTarea(el);
    })
  } 
  
  function renderizarTareas(listado) { 
    
    addTarea(listado[listado.length -1 ] )

  }
  function addTarea(element) {
    let tarea = document.createElement('li');
    tarea.classList.add('tarea')
    tarea.innerText = element;
    contenedorTareas.appendChild(tarea);
  }
  
  
  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() { }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() { }
});
