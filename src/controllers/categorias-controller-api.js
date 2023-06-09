const {response, request} = require('express'); 
const { miConexion} = require('../database/db')
const categoriasAPI = {};

categoriasAPI.getTodasCategorias = async (req,res,next)=>{
    try{
        const conexion = await miConexion();
        const [ rows ] = await conexion.query('SELECT * FROM categorias');
        if(rows.length>0){
            res.status(200).json({
                estado:1,
                mensaje:"Registros encontrados",
                categorias:rows
            })
        } else {
            res.status(404).json({
                estado:0,
                mensaje:"Registros no encontrados",
                categorias:[]
            })
        }
        } catch (error){
            next(error);
        }
}


categoriasAPI.getTodasCategoriaPorID = async (req,res,next)=>{
    try {
        const { id } = req.params;
        const conexion = await miConexion();
        const [ rows ] = await conexion.query('SELECT * FROM categorias WHERE id = ?',[id]);
        if(rows.length>0){
            res.status(200).json({
                estado:1,
                mensaje:"Categoria encontrada",
                categorias:rows[0]
            })
        } else {
            res.status(404).json({
                estado:0,
                mensaje:"Categoria no encontrada",
                categorias:rows
            })
        }
    } catch (error) {
        next(error)
    }

}

categoriasAPI.deleteCategoriaPorID = async (req,res,next)=>{
    try {
        const { id } = req.params;
        const conexion = await miConexion();
        const resultado = await conexion.query('DELETE FROM categorias WHERE id = ?',[id]);
        if(resultado[0].affectedRows>0){
            res.status(200).json({
                estado:1,
                mensaje:"Categoria eliminada",
            })
        } else {
            res.status(404).json({
                estado:0,
                mensaje:"Categoria no encontrada",

            })
        }
    } catch (error) {
        next(error)
    }

}

categoriasAPI.postCategoria = async (req,res,next)=>{
    try {
        const { descripcion, observaciones} = req.body;
        if(descripcion==undefined||observaciones==undefined){
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta. Te faltan parametros"
            })
        } else {
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO categorias(descripcion,observaciones) VALUES(?,?)',[descripcion,observaciones]);
            if(resultado[0].affectedRows>0){
                res.status(201).json({
                    estado:1,
                    mensaje:"Categoria creada",
                    categoria:{
                        id              :   resultado[0].insertId,
                        descripcion     :   descripcion,
                        observaciones   :   observaciones
                    }
                })
            } else {
                res.status(500).json({
                    estado:0,
                    mensaje:"Categoria no creada"
                })
            }
        }
    }
    catch (error) {
         next(error)
    }
}

categoriasAPI.putCategoriaPorID = async (req,res,next)=>{
    try {
        const { id } = req.params;
        const {descripcion, observaciones} = req.body;
        if(descripcion==undefined||observaciones==undefined){
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta. Te faltan parametros"
            })
        } else {
            const conexion = await miConexion();
            const resultado = await conexion.query('UPDATE categorias SET descripcion = ?, observaciones = ? WHERE id = ?',[descripcion,observaciones,id]);
            if(resultado[0].affectedRows>0){
                if(resultado[0].changedRows>0){
                    res.status(200).json({
                        estado:1,
                        mensaje:"Categoria actualizada",
                        categoria:{
                            id              :   resultado[0].insertId,
                            descripcion     :   descripcion,
                            observaciones   :   observaciones
                        }
                    })
                } else {
                    res.status(200).json({
                        estado:0,
                        mensaje:"Categoria no actualizada"
                    })
                }
            } else {
                res.status(404).json({
                    estado:0,
                    mensaje:"Categoria no encontrada"
                })
            } 
        }
    }
    catch (error) {
         next(error)
    }
}


module.exports=categoriasAPI;