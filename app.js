import express from "express"
const app=express()

//importante la carpeta de validationes, debes importar con las extensiones
import {ValidandoGuerrero,ValidarParcialmnetePeleadores} from "./CarpetaValidar/ValidarGuerreros.js"


// const peleadores=require("./guerreros.json") --> esta linea es reemplazada por la de abajo ya que este tipo de importar es commonJS , 
// Y LA LINEA DE ABAJO ES EJmodule
import fs from 'node:fs'

//PARA VALIDATIONS, VERY IMPORTANT
import z, { int, json, string } from 'zod'
import { error } from "node:console"

//este es para pamejar archivos de formatos json(1ro debes importa fs): creas tu propio metodo
const peleadores=JSON.parse(fs.readFileSync("./guerreros.json","utf-8"))

//este middleware se usa para traer del body parte por parte y parsearlo(convertirlo en objeto de string)
//Si no haces esto te saldra error en el POST (undefined)
app.use(express.json());


//declarando ORIGIN para problemas de CORS
const ACCEPTED_ORIGINS=[
    'http://localhost:8080',
    'http://localhost:8085',
    'http://peleadores.com'
]


//1: pagina de inicio
app.get("/",(req,res)=>{
    /*
    const lista=[1,3,5,20]
    const nuevalista=lista.map(item=>
          `${item*2}`
    )
    console.log(nuevalista);
    */        
    res.json({mensaje:"Hola , soy la pagina principal,Fecha 28 de octubre 2025"})
})


//2: GET peleadores, tambien si se pasas una query de RACE te lo va filtrar
app.get("/peleadores",(req,res)=>{
    //esto soluciona el problema del CORS
    const origin=req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin)   
     }

    const {race}=req.query
    if(race){        
        let listabuscada=peleadores.filter(item=>item.race.toLowerCase()===race.toLowerCase())
        return res.json(listabuscada)
    }
        res.json(peleadores)
})


//3:GET peleadores por ID
app.get("/peleadores/:id",(req,res)=>{
    const {id}=req.params
    let PeleadorBuscado=peleadores.find(item=>item.id==id)
    if(PeleadorBuscado){
        return res.json(PeleadorBuscado)       
    }
    res.status(404).json({mensaje:"No se encontro al peleador"})
})

//4: POST insertar nuevo peleador
app.post("/peleadores",(req,res)=>{
    
    const resultadoValidar=ValidandoGuerrero(req.body)
    if(resultadoValidar.error){
        return res.status(400).json({error:JSON.parse(resultadoValidar.error.message)})
    }
    
    let newPeleador={...resultadoValidar.data}
   peleadores.push(newPeleador)
   res.json(peleadores)   
})

//5: PATCH actualizar solo una parte de un registro
app.patch("/peleadores/:id",(req,res)=>{
    const resultadoValidar=ValidarParcialmnetePeleadores(req.body)
    if(!resultadoValidar.success){
        res.status(400).json({error:JSON.parse(resultadoValidar.error.message)})
    }
    const {id}=req.params
    const Index=peleadores.findIndex(item=>item.id==id)
    if(Index<0){
        res.status(400).json({error:"No se econtro al peleador"})
    }

    const UpdatePeleador={...peleadores[Index],...resultadoValidar.data}
    peleadores[Index]=UpdatePeleador
    res.json(peleadores)
})

//6 delete: eliminar registro 
app.delete("/peleadores/:id",(req,res)=>{

    const origin=req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin)   
     }

    const {id}=req.params
    const index=peleadores.findIndex(item=>item.id==id)

    if(index<0){
        return res.status(404).json({message:"no se puede eliminar, porque no hay registro"})
    }
    peleadores.splice(index,1)

    return res.status(288).json({message:"deleted"})
})

app.options("/peleadores/:id",(req,res)=>{
    const origin=req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin) 
        res.header('Access-Control-Allow-Methods','DELETE,GET,POST,PATCH,PUT')  
     }
     res.send(200)
})

const puerto=process.env.PORT || 3000
app.listen(puerto,()=>{
    console.log(`http://localhost:${puerto}`);
    
})
