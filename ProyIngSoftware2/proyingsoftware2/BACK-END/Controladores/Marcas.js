import express from "express";
import Marca from '../Models/Marca.js'
const router = express.Router();

router.post('/newMarca', async (req, res) => {
    try {
      const marcaExistente = await Marca.findOne( {where: {
        nombre: req.body.nombre,
      } })
      if(marcaExistente !== null){
        return res.status(409).send({
          Mensaje: 'Marca existente',
          Marca: marcaExistente
        });
      }else {
  
        const marcaNueva = await Marca.create({
          nombre: req.body.nombre,
        })
        return res.status(201).send({
          Mensaje: 'Marca creada exitosamente',
          Marca: marcaNueva
        });
      }
    } catch (error){
      console.error("Error al crear marca", error);
      res.status(500).send('Error al crear marca');
    }  
  })

router.get('/MarcaAll',async(req,res)=>{

    const marcas = await Marca.findAll()

    res.status(200).send(marcas)

})


export default router;