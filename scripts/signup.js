// import { compararContrasenias, } from "./utils";

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.forms[0];

  const inputNombre = document.getElementById('inputNombre');
  const inputApellido = document.getElementById('inputApellido');
  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');
  const inputPasswordRepetida = document.getElementById('inputPasswordRepetida');

  let arrErrores = []

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    validarDatos();

    function validarDatos() {
      if (inputNombre.value == '' || inputApellido.value == '') {
        let mensaje = 'El nombre y/o apellido deben estar completos';
        arrErrores.push(mensaje);
      }
      if (inputNombre.value == '' || inputApellido.value == '') {
        let mensaje = 'El nombre y/o apellido deben estar completos';
        arrErrores.push(mensaje);
      }
      if (inputPassword.value != inputPasswordRepetida.value) {
        let mensaje = 'La contraseña y la repeticion, no coinciden';
        arrErrores.push(mensaje);
      }
      if (inputEmail.value.indexOf('@') == -1) {
        let mensaje = 'Ingrese correctamente su email.  Ejemplo: "nombreapelido@correo.com';
        arrErrores.push(mensaje);
      }
    }

    const contenedorErrores = document.createElement('div');
    contenedorErrores.classList.add('contenedorErrores');

    if (arrErrores.length > 0) {
      for (let i = 0; i < arrErrores.length; i++) {
        const errores = document.createElement('p');
        errores.classList.add('errores')
        errores.innerText = arrErrores[i];
        contenedorErrores.appendChild(errores)
        form.append(contenedorErrores)
      }
    } else {
      let usuario = {
        firstName: inputNombre.value,
        lastName: inputApellido.value,
        email: inputEmail.value,
        password: inputPassword.value,
      }
      realizarRegister(usuario);
    }

  });


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(settings) {

    const apiURL = "https://ctd-fe2-todo-v2.herokuapp.com/v1/users";

    const configuraciones = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    };

    fetch(apiURL, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((respuesta) => {
        if (respuesta.jwt) {
          localStorage.setItem("jwt", respuesta.jwt);
          location.replace("/mis-tareas.html");
        } else {
          alert('El usuario ya se encuentra registrado')
        }
      });
  }
});
