function iniciarSesion(){
    var usuario=document.getElementById('usuario').value;
    var contraseña=document.getElementById('clave').value;
    var promise=$.ajax({
        type:'POST',
        url:'/identificadorNuevo',
        //lo que envio
        data:JSON.stringify({username:usuario,password:contraseña}),
        contentType:'application/json;charset=UTF-8',
        dataType:'json'
    });
//TRATAR LA RESPUESTA QUE DA EL SERVIDOR
    promise.always(function(data){
        if(data.res=="login true"){//si la respuesta es cotrecta entra aqui
            document.cookie="contraseña"+data.res.password;
                alert("Estas logeado");
                window.location.replace('/rutaSegura');
        }
        else if(data.res=="usuario no valido"){//si el usuario no es valido aqui
            alert("No estas autorizado");
        }else if(data.res=="login failed"){//si se ha dejado algun campo sin rellenar aqui
            alert("Debes introducir el usuario y contraseña");
        }
        else{//error imprevisto
            window.alert("Error");
        }
    })
}
function registrarUsuario(){
    var usuario=document.getElementById('usuario').value;
    var contraseña=document.getElementById('clave').value;
    var promise=$.ajax({
        type:'POST',
        url:'/registrarNueva',
        //lo que envio
        data:JSON.stringify({username:usuario,password:contraseña}),
        contentType:'application/json;charset=UTF-8',
        dataType:'json'
    });
//TRATAR LA RESPUESTA QUE DA EL SERVIDOR
    promise.always(function(data){
        if(data.res=="register true"){//si la respuesta es cotrecta entra aqui
            document.cookie="contraseña"+data.res.password;
                alert("Estas registrado");
                window.location.replace('/login');
        }
        else if(data.res=="usuario ya existente"){//si el usuario no es valido aqui
            alert("Ya existe un usuario con ese nombre");
        }else if(data.res=="register failed"){//si se ha dejado algun campo sin rellenar aqui
            alert("Debes introducir el usuario y contraseña");
        }
        else{//error imprevisto
            window.alert("Error");
        }
    })
};
function obtenerUsuarios(){
    var promise=$.ajax({
        type:'POST',
        url:'/listado',
        //lo que envio
        data:JSON.stringify({}),//datos vacios de JSON
        contentType:'application/json;charset=UTF-8',
        dataType:'json'
    });
    promise.done(function(data){//se ejecuta cuando la promesa se resulva con exito
        if(data && Array.isArray(data)){//verifican que los datos existan y sean un array
            var listaUsuarios=document.getElementById('lista');//coge el ul del html
            data.forEach(function(usuario){//itera sobre cada data que ahora se llama usuario
                var nuevoElemento=document.createElement('li');//cada vez crea un nuevo elemento
                nuevoElemento.innerText=usuario.nombre;

                listaUsuarios.appendChild(nuevoElemento);
            })
        }
    })
    promise.fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error al obtener usuarios:', textStatus, errorThrown);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    });
}
