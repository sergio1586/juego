function peticionHTTP(){
    if(window.XMLHttpRequest){
    var  peticion=new XMLHttpRequest();//Hacemos la peticion
    }else if(window.ActiveXObject){
    var  peticion=new ActiveXObject("Microsot.XMLHTTP");
    }

    peticion.onreadystatechange=mostrarContenido;//Es para que este a la espera de respuesta 

    peticion.open('GET','/hola');//abrimos la peticion
    peticion.send(null);//envia el body

    function mostrarContenido(){
        if(peticion.readyState==4){
            if(peticion.status==200){
                alert("la peticion dice: "+peticion.responseText);
            }
        }
    }
}
function peticionPOST(){
        if(window.XMLHttpRequest){
        var  peticion=new XMLHttpRequest();//Hacemos la peticion
        }else if(window.ActiveXObject){
        var  peticion=new ActiveXObject("Microsot.XMLHTTP");
        }
    
        peticion.onreadystatechange=mostrarContenido;
        peticion.open('POST','/identificador');
        peticion.setRequestHeader('Content-Type','application/json');
        peticion.send(JSON.stringify({username:"paco",password:"1234"}));

        peticion.send(null);//si no lo pones actua igual
        function mostrarContenido(){
            if(peticion.readyState==4){
                if(peticion.status==200){
                    //alert(peticion.responseText);
                    alert("Estas logeado");
                    window.location.replace("/rutaSegura");
                }
            }
        }
}