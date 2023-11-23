const express = require('express');//IMPORTAMOS LA BIBLIOTECA EXPRESS
var fs=require('fs');
var cookieParser=require('cookie-parser');//IMPORTAMOS LA BIBLIOTECA COOKIEPARSER
var session=require('express-session');//IMPORTAMOS LA BIBLIOTECA EXPRESS-SESSION de autenticacion

//rutas para certificado y clave privada
//const clavePrivada=fs.readFileSync('miclave.key','utf8');
//const certificado=fs.readFileSync('micertificado.pem','utf8');
//var credenciales={ key:clavePrivada, cert:certificado, passphrase:'123456' };


const mongoose=require('mongoose');//biblioteca de mongo
const {conectarDB,Usuario}= require('./mongo');//importar la conexion de mongo y el modelo
const app= express();//GUARDAMOS LA BIBLIOTECA EN UNA CONSTANTE
//var https=require('https');
//var server =https.createServer(credenciales,app);
var server=require('http').Server(app);
var port = process.env.PORT||3000;
app.use(express.json());//USAMOS JSON
app.use(express.static('public'));//Permitimos a al servidor que tenga acceso a la carperta public
app.use(session({
    secret:'tu cadena secreta',//Agrega tu propia cadena secreta
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}));
app.use(cookieParser('your secret here'));//Clave de cifrado
var usuarios=cargarUsuarios();

//FUNCIONES
var auth=function(req,res,next){
    if(req.session && req.session.user === "admin" && req.session.admin){
        return next();
    }
    else{
        return res.sendStatus(401);
    }
}
//FUNCIONES GET
app.get('/',(req,response)=>{
    var contenido=fs.readFileSync("./public/index.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});
app.get('/rutaSegura',auth,(req,response)=>{
    var contenido=fs.readFileSync("public/juego.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});
app.get('/login',(req,response)=>{
    var contenido=fs.readFileSync("public/login.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});
app.get('/hola',(req,response)=>{
    response.send("Hola Munda");
});
app.get('/peticion',(req,response)=>{
    var contenido=fs.readFileSync("public/peticionMedac.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});
app.get('/registro',(req,response)=>{
    var contenido=fs.readFileSync("public/registro.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});
app.get('/vealista',auth,(req,response)=>{//va a la lista si estas autorizado
    var contenido=fs.readFileSync("public/listado.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
})

//FUNCIONES POST

//funcion de error
/*app.post('/error',function(req,res){
    process.exit(1)
});*/

app.post('/listado',auth,async function(req,res){
    try{
    usuarios= await Usuario.find({}).select('nombre');//devuelve todos los usuarios pero solo el nombre
    res.json(usuarios);//lo devuelve en formato JSON
    }catch(err){
    console.err('Error al conectar',err);
    }
});
app.post('/identificador',function(req,res){
    if(!req.body.username || !req.body.password){//si no ha introducido un campo
        res.send({"res":"login failed"});
    }
    else{//si si esta autorizado entra
        const usuarioEncontrado=usuarios.find(usuario=>
            usuario.username==req.body.username && usuario.password==req.body.password
            );
        if(usuarioEncontrado){
            req.session.user="admin";
            req.session.admin=true;
            return res.send({"res":"login true"});
        }
        else{
            res.send({"res":"usuario no valido"});
        }  
    }
});
app.post('/identificadorNuevo',async function(req,res){//tiene que se asincrona
    if(!req.body.username || !req.body.password){//si no ha introducido un campo
        res.send({"res":"login failed"});
    }
    else{//si si esta autorizado entra
        try{
            usuarioEncontrado= await Usuario.findOne({nombre: req.body.username,password:req.body.password});
        if(usuarioEncontrado){
            req.session.user="admin";
            req.session.admin=true;
            return res.send({"res":"login true"});
        }
        else{
            res.send({"res":"usuario no valido"});
        }  
        }catch(err){
            console.error('Error al identificar usuario',err);
        }
        
    }
});
app.post('/registrar',function(req,res){//registra los usuarios en el JSON
    if(!req.body.username || !req.body.password){//si no ha introducido un campo te sale que no estas registrado
        res.send({"res":"register failed"});
    }
    else{
        let usuarioExiste=false;
        for(let i=0;i<usuarios.length;i++){//buscamos que el usuario no exista ya
            
            if(usuarios[i].username==req.body.username){//si exite cambiamos la variable a true
                usuarioExiste=true;
            }
        }
        if(usuarioExiste){//si existe enviamos la respuesta de que ya existe
            res.send({"res":"usuario ya existente"})
        }else{
            var usuario={//si no existe creamos el usuario
                username:req.body.username,
                password:req.body.password
            }
            usuarios.push(usuario);//añadimos el usuario al final del array
            console.log(usuarios);
            guardarUsuarios(usuarios);//guardamos de nuevo los usuarios
            res.send({"res":"register true"});
        }
    }

});
app.post('/registrarNueva',async function(req,res){//registra los usuarios en la base de MONGO
    if(!req.body.username || !req.body.password){//si no ha introducido un campo te sale que no estas registrado
        res.send({"res":"register failed"});
    }
    else{
        try{
            usuarioExistente= await Usuario.findOne({nombre: req.body.username});//mientras no me devuelvas esto no sigue 
        }catch(err){
            console.error('Error al crear el usuario',err);
        }
        if(usuarioExistente){//si el usuario existe me va a saltar este error
            console.log('Ya existe un usuario con ese nombre');
            res.send({"res":"usuario ya existente"})
        }else{//si no existe creamos un nuevo usuario
            const nuevoUsuario=new Usuario({
                nombre: req.body.username,//le decimos que el nombre de la BBDD es username
                password:req.body.password////decimos que la contraseña de la BBDD es password
            });
            try{
                nuevoUsuario.save();//guardamos el nuevo usuario
                console.log('Nuevo usuario creado',nuevoUsuario);
                res.send({"res":"register true"});//enviamos la respuesta bien
            }catch(err){
                console.error('Error al crear usuario',err);
            }
        }
    }
});
//FUNCINES DE LOGICA
function guardarUsuarios(usuarios){//FUNCION QUE SIRVE PARA GUARDAR LOS USUARIOS
    const json=JSON.stringify(usuarios);//CREAMOS EL ARCHIVO
    fs.writeFileSync('usuasios.json',json,'utf8',function(err){
        if(err){
            console.log('Ha ocurrido un error al guardar los usuarios',err);
        }else{
            console.log('Usuarios guardados correctamente');
        }
    });
}
function cargarUsuarios(){//FUNCION QUE SIRVE PARA CARGAR LOS USUARIOS GUARADADOS
    try{
        const data = fs.readFileSync('usuasios.json', 'utf8');//LEER ARCHIVO
        console.log('###### USUARIOS CARGADOS #######');
        console.log(JSON.parse(data));//DESERIALIZAR JSON CON OBJETO JAVASCRIPT
        return JSON.parse(data);
    }catch(err){
        console.log('Error al leer los usuarios desde el archivo',err);
        return [];
    }
}
conectarDB();//conectar a la base


//FUNCION MAIN DEL SERVIDOR
server.listen(port,()=>{
    console.log('App escuchando en el puerto 3000');
});