import express from "express";
import { Producto, ProductoDetalle, Botica, Marca } from "../Models/Relaciones.js";
import { Op } from "sequelize";
import multer from 'multer';
import path from 'path';


const router = express.Router();

router.use('/images', express.static('Imgs'));

const storage = multer.diskStorage({
  destination: function(req,file,cb){
     cb(null, 'Imgs/');
  },
  filename: function(req,file,cb){
    cb(null,Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

router.post('/newDetalle', upload.single('imagen'), async (req, res) => {
    try {
      const detalleExistente = await ProductoDetalle.findOne( {where: {
        productoID: req.body.productoID,
        boticaID: req.body.boticaID
      } })
      if(detalleExistente !== null){
        return res.status(409).send({
          Mensaje: 'El producto ya tiene descripcion',
          Producto: detalleExistente
        });
      }else {
  
        const imagen = req.file;
        const imagenUrl= `/images/${imagen.filename}`;
  
        const detalleNuevo = await ProductoDetalle.create({
          boticaID: req.body.boticaID,
          productoID: req.body.productoID,
          descripcion: req.body.descripcion,
          caracteristicas: req.body.caracteristicas,
          imageUrl: imagenUrl,
          cantidad: req.body.cantidad,
          precio: req.body.precio
        })
        return res.status(201).send({
          Mensaje: 'Descripcion agregada exitosamente',
          Producto: detalleNuevo
        });
      }
    } catch (error){
      console.error("Error al agregar detalle", error);
      res.status(500).send('Error al agregar detalle');
    }  
  })

  router.get('/ProductosAll', async (req, res) => {
    try {
      const productosDetalles = await ProductoDetalle.findAll({
        include: [
          {
            model: Producto, 
            attributes: ['id', 'nombre'], 
            include: [
              {
                model: Marca, 
                attributes: ['nombre'], 
              }
            ]
          },
          {
            model: Botica, 
            attributes: ['nombre', 'direccion','estado'], 
          }
        ],
        order: [['id', 'ASC']] 
      });
  
      return res.status(200).send({ ProductosDetalles: JSON.parse(JSON.stringify(productosDetalles)) });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

router.get('/searchProductos', async (req, res) => {
    try {
        const { nombreProducto } = req.query; 
        const trimmedNombreProducto = nombreProducto ? nombreProducto.trim() : ''; 

        
        const whereCondition = trimmedNombreProducto ? {
            nombre: {
                [Op.iLike]: `%${trimmedNombreProducto}%`
            }
        } : {};

        const productosDetalles = await ProductoDetalle.findAll({
            include: [
                {
                    model: Producto,
                    attributes: ['id', 'nombre'],
                    where: whereCondition, 
                    include: [
                        {
                            model: Marca,
                            attributes: ['nombre'],
                        }
                    ]
                },
                {
                    model: Botica,
                    attributes: ['nombre', 'direccion','estado'],
                }
            ],
            order: [['id', 'ASC']]
        });

        if (productosDetalles.length === 0) {
            return res.status(404).send({ message: `No se encontró ningún producto con el término "${trimmedNombreProducto}"` });
        }

        return res.status(200).send({ ProductosDetalles: JSON.parse(JSON.stringify(productosDetalles)) });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

export default router;