class Usuario{
    constructor(nombre, intentos, edad,email){
        this.nombre=nombre;
        this.intentos=intentos;
        this.edad=edad;
        this.email=email;
        
    }
    diferenciaVidaIntento(vidas){
        return this.intentos-vidas;
    }
}
const formulario= document.getElementById("formulario");
//COGER EL PARAMETRO DE LA URL
const parametrosUrl = new URLSearchParams(window.location.search);


const usuarios=[];
formulario.addEventListener('submit',function(evento){//esta a la espera de que se pulse el boton submit
    evento.preventDefault();//Hacemos que el sumbit no envie nada a ningun lado
    const patronEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;//expresion regular de validacion de email encontrada en https://stackoverflow.com/questions/4640583/what-are-these-javascript-syntax-called-a-za-z0-9-a-za-z0-9
    const nombre=formulario.elements['nombre'].value;//recogemos nombre, edad y email
    const edad=formulario.elements['edad'].value;
    const email=formulario.elements['email'].value;
    // Obtiene el valor del parámetro intentos
    const intentos = parseInt(parametrosUrl.get("intentos"));
    const vidas=parseInt(parametrosUrl.get("vidas"));
    const tiempo=parseFloat(parametrosUrl.get("tiempo"));
    if(!patronEmail.test(email)){
        alert("Email no valido");
    }else{
        var u1=new Usuario(nombre,intentos,edad,email);
        var diferencia=u1.diferenciaVidaIntento(vidas);
        console.log(tiempo);
        window.location.href = "felicidades.html?nombre=" + u1.nombre + "&intentos=" + u1.intentos + "&edad=" + u1.edad+ "&email="+u1.email+"&diferencia="+diferencia+"&tiempo="+tiempo;
    }
    
})