const mongoose=require('mongoose');//biblioteca de mongo
const mongoDBURI='mongodb+srv://sergioMedac:8248567@cluster0.mrajnew.mongodb.net/';
//esquema de los datos
const usarioSchema=new mongoose.Schema({//este es el esquema que defino
    nombre:String,
    password:String
});

const Usuario=mongoose.model('Usuario',usarioSchema);//este es el modelo a partir del esquema que he hecho

//funcion conectar
const conectarDB = async ()=>{
    try{
        await mongoose.connect(mongoDBURI,{ useNewUrlParser:true,//conectar a MongoDB
        useUnifiedTopology: true})
        console.log('Conectado a MongoDB')
    }catch(err){
        console.error('Error al conector a MongoDB',err);
        process.exit(1);//Detiene la aplicacion en caso de error
    }
    
};
module.exports={conectarDB,Usuario};