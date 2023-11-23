function getCokkie(nombre){//funcion para capturar la cookie
    const valorCokkie=document.cookie.match('(^|;)\\s*'+nombre+'\\s*=\\s*([^;]+)');
    return valorCokkie ? valorCokkie.pop() : null;
}
//Capturamos el tiempo con la cookie, solo funciona en servidor o Mozilla DEV
const tiempoCookie=getCokkie('tiempoTranscurrido');
if(tiempoCookie){
    const tiempoJuego=document.getElementById("tiempoJuego");//cogemos el elemento p en el html
    const segundos=tiempoCookie/1000;//dividimos el tiempo que tenemos entre 1000
    const segundosDecimal=segundos.toFixed(1);//dejamos solo un decimal
    tiempoJuego.textContent=`Tiempo de juego: ${segundosDecimal} segundos`;//le ponemos de valor el tiempo transcurrido
}else{//como si no es servidor no va a mostrar la cookie, mostramos el tiempo asi
    alert("NO ESTAS EN UN SERVIDOR, VA A SALIR EL TIEMPO MEDIANTE UN PARAMETRO DE URL");
    document.addEventListener("DOMContentLoaded",function(){//esperamos a que este cargado el DOM
        const parametrosUrl = new URLSearchParams(window.location.search);//COHEMOS LOS PARAMETROS DE LA URL
        var tiempo=0;//inicializamos la variable para el tiempo
        parametrosUrl.forEach(function(valor,clave){//recorremos los parametros
            if(clave.startsWith("nombre")){
                tiempo = parametrosUrl.get("tiempo" + clave.substring(6));//guardamos el tiempo en la variable
            }
        })
        
    const tiempoJuego=document.getElementById("tiempoJuego");//cogemos el elemento p en el html
    const segundos=tiempo/1000;//dividimos el tiempo que tenemos entre 1000
    const segundosDecimal=segundos.toFixed(1);//dejamos solo un decimal
    tiempoJuego.textContent=`Tiempo de juego sin cookie: ${segundosDecimal} segundos`;
    })
    
}

//EL EVENTO SALTARA CUNADO LA PAGINA SE HAYA CARGADO POR COMPLETO
document.addEventListener("DOMContentLoaded", function () {
    const parametrosUrl = new URLSearchParams(window.location.search);//GUARDAMOS LA URL EN UNA CONSTANTE
    const listaDeParticipantes = document.getElementById("listaParticipantes");//GUARDAMOS LA UL EN UNA CONSTANTE

    parametrosUrl.forEach(function (valor, clave) {//AQUI BUSCA EN LA URL EL PARAMETRO CON LA CLAVE 
    if (clave.startsWith("nombre")) {//VA A BUSCAR HASTA ENCONTRAR UN PARAMETRO CON LA CLAVE NOMBRE
        const nombre = valor;//DAMOS EL VALOR DEL NOMBRE A LA CONSTANTE
        const intentos = parametrosUrl.get("intentos" + clave.substring(6));//RECUPERAMOS DE LA URL LOS INTENTOS, SUBSTRING COGE LO QUE HAY DESDE LA POSICION 6
        const edad = parametrosUrl.get("edad" + clave.substring(6));
        const email= parametrosUrl.get("email"+clave.substring(6));
        const diferencia=parametrosUrl.get("diferencia"+clave.substring(6));
        const nombreJ = document.createElement("li");//CREAMOS ELEMENTOS LI POR CADA VALOR
        nombreJ.textContent = `Nombre: ${nombre}`;
        listaDeParticipantes.appendChild(nombreJ);
        const intentosJ = document.createElement("li");
        intentosJ.textContent= `Intentos: ${intentos}`
        listaDeParticipantes.appendChild(intentosJ);
        const edadJ = document.createElement("li");
        edadJ.textContent= `Edad: ${edad}`
        listaDeParticipantes.appendChild(edadJ);
        const emailJ = document.createElement("li");
        emailJ.textContent= `Email: ${email}`
        listaDeParticipantes.appendChild(emailJ);
        const diferenciaJ=document.createElement("li");
        diferenciaJ.textContent=`La diferencia entre tus intentos y la vidas es: ${diferencia}`;
        listaDeParticipantes.appendChild(diferenciaJ);
    }
    });

    if (listaDeParticipantes.childElementCount === 0) {//POR SI ACASO NO INTODUCIMOS EL PARTICIPANTE
        alert("No se encontraron datos de participantes en la URL.");

    }
});



