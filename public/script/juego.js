//Aqui metemos las ruta de los imagenes en constantes
const perro = 'imagenes/perro.png';
const jirafa = 'imagenes/jirafa.png';
const leon = 'imagenes/leon.png';
const mono = 'imagenes/mono.png';
const oso = 'imagenes/oso.png';
const pajaro = 'imagenes/pajaro.png';
//cookie
const tiempoInicio=new Date();
document.cookie="tiempoInicio="+tiempoInicio;
//console.log(document.cookie="tiempoInicio="+tiempoInicio);
//Metemos las constantes en un array 2 veces para tener 12 posiciones
var cartas=[
    perro,
    perro,
    jirafa,
    jirafa,
    leon,
    leon,
    mono,
    mono,
    oso,
    oso,
    pajaro,
    pajaro
];
let cartasVolteadas=[];//Array para almacenar las cartas cuando se voltean       
let cartasVolteadasId=[];//Array para introducir los Id de las cartas que se voltean
let cartasAdivinadas=0;
let vidas=parseInt(prompt("¿Cuantas vidas quieres?"));//Numero de vidas que quiero
let intentos=0;
if(isNaN(vidas)){//Por si se nos olvida meter un numero la primera vez
    vidas=parseInt(prompt("NO HAS SELECCIONADO VIDAS:¿Cuantas vidas quieres?"));
}
document.getElementById('contador').textContent="Vidas: "+vidas;//Vidas seleccionadas
const tablero=document.getElementById('tablero');

//Una funcion para barajar las cartas de manera aleatoria

function barajarCartas() {
    for(let i=cartas.length-1;i>0;i--){//Vamos de atras del array hacia adelante para que el orden sea aleatorio
        let j=Math.floor(Math.random()*(i+1));//floor lo usamos para que los numeros sean enteros
        [cartas[i],cartas[j]]=[cartas[j],cartas[i]];//Intercambiamos las posociones de las cartas 
    }
    
}
// Funcion para crear el tablero con JavaScript

function crearTablero() {
    let i = 0;
    while (i < cartas.length) {
        let carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.id = i;
        carta.textContent = '?';
        carta.addEventListener('click', darVueltaCarta);
        tablero.appendChild(carta);
        i++;
    }
}
//Funcion para dar la vuelta a las cartas
function darVueltaCarta(){
    let id=this.dataset.id;//asignamos el id de la carta que llama a ID
    if(this.classList.contains('cartaVolteada')){//Primero comprovamos que la carta que llama no ha sido volteada ya
        alert("Carta volteada ya");
        location.reload();//Recargamos la pagina si se pulsa una carta ya pulsada
    }
    const img = document.createElement('img');//Creamos una etiqueta img y le metemos la imagen que corresponde al id
    img.src = cartas[id];//La ruta que ponemos es la de la imagen que llama
    this.innerText='';//Quita la interrogacion
    this.appendChild(img);//añadimos a el div carta la imagen selecccionada


    this.classList.add('cartaVolteada');//añadimos la clase de CSS cartaVolteada a cada carta
    cartasVolteadas.push(cartas[id]);//añadimos la carta a las cartas Volteadas
    cartasVolteadasId.push(id);//añadimos el id a el array de idVolteadas

    if(cartasVolteadas.length===2){//verificamos que 2 cartas se han volteado
        setTimeout(verificarCoincidencia,800); //Con esto tenemos un retraso de 0,8 segundo para que podamos ver si las cartas qu no son iguales cuales son
    }
}
//funcion para verificar las coincidencias
function verificarCoincidencia() {
    let id1=cartasVolteadasId[0];//Obtenemos id de las cartas que se han seleccionado
    let id2=cartasVolteadasId[1];//Obtenemos id de las cartas que se han seleccionado
    let carta1 = document.querySelector(`[data-id="${id1}"]`);//Asigno la carta en funcion de su id a cada variable
    let carta2 = document.querySelector(`[data-id="${id2}"]`);

    if (cartasVolteadas[0] === cartasVolteadas[1] && id1 !== id2) {//compruebo si las 2 cartas que se añaden al array cartas volteadas tienen la misma ruta y tienen distintos id
        cartasAdivinadas =cartasAdivinadas +  2;//si es asi sumamos 2 al contador para saber que tenemos 1 pareja

        if (cartasAdivinadas === cartas.length) {//Cuando encontremos todas a la vez nos mostrara la nueva pagina
            const tiempoFin=new Date();
            const tiempoTranscurrido=tiempoFin-tiempoInicio;
            document.cookie="tiempoTranscurrido="+tiempoTranscurrido;
            //console.log(document.cookie="tiempoTranscurrido="+tiempoTranscurrido);
            window.location.href="formulario.html?intentos="+intentos+"&vidas="+vidas+"&tiempo="+tiempoTranscurrido;
        }
    } else {//Si la ruta de las 2 cartas no son iguales o los id fueran iguales, pondriamos una interrogacionde nuevo
            carta1.textContent = '?';
            carta2.textContent = '?';
            carta1.classList.remove('cartaVolteada');//quitamos las cartas de carta volteada
            carta2.classList.remove('cartaVolteada');
            vidas--;
            intentos++;
    }
    cartasVolteadas = [];
    cartasVolteadasId = [];
    //contador de vidas
    document.getElementById('contador').textContent="Vidas: "+vidas;
    if(vidas===0){//Si llega a 0 empezamos de nuevo
        alert("Vidas Gastadas");
        location.reload();
    }
}
//funcion para iniciar juego
function iniciarJuego(){
    barajarCartas();
    crearTablero();
};






