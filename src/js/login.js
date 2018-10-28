const mail = document.getElementById('mailUser');
const clave = document.getElementById('claveUser');

function login (){
    //even.preventDefault();
console.log("aqui");
    firebase.auth().signInWithEmailAndPassword(mail.value, clave.value)//  auntenticar email y contraseña
        .then(listo => {
        // colocar la redirección cuando el usuario inicie sesion
        location='../html/presentacion.html'
        console.log(listo);
        }).catch(function(error) {
        // errores de autenticación.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        // errores.innerHTML= '';
        // errores.innerHTML +=`<p class='red-text'>${"Contraseña o Email inválido"}</p>`
    }); 
    return false;
}
