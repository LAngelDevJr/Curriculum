import express from "express";
import {Producto, Marca, Botica, ProductoDetalle, ProductoOrden} from "../models/Relaciones.js";
import { Op } from "sequelize";
const router = express.Router();


router.post('/newProductos', async (req, res) => {
  try {
    const productoExistente = await Producto.findOne( {where: {
      nombre: req.body.nombre,
      nRegistroSanitario: req.body.registroSanitario,
    } })
    if(productoExistente !== null){
      return res.status(409).send({
        Mensaje: 'Producto existente',
        Producto: productoExistente
      });
    }else {

      const productoNuevo = await Producto.create({
        nombre: req.body.nombre,
        presentacion: req.body.presentacion,
        nRegistroSanitario: req.body.registroSanitario,
        categoria: req.body.categorias,
        marcaID: req.body.marcaID,
      })
      return res.status(201).send({
        Mensaje: 'Producto creado exitosamente',
        Producto: productoNuevo
      });
    }
  } catch (error){
    console.error("Error al crear producto", error);
    res.status(500).send('Error al crear producto');
  }  
})
router.get('/ProductosTodos', async (req,res)=>{
  const productos = await Producto.findAll()
  res.send(productos)
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
          attributes: ['nombre', 'direccion'], 
        }
      ],
      order: [['id', 'ASC']] 
    });

    return res.status(200).send({ ProductosDetalles: JSON.parse(JSON.stringify(productosDetalles)) });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get('/BusquedaAgrega', async(req,res)=>{
  const nombre = req.query.nombre
  const marca = req.query.marca
  const producto = await Producto.findAll({
    include:{
      model: Marca,
      where:{nombre :{[Op.iLike]: `%${marca}%`}},
      attributes:['nombre']
    },
    where:{
      nombre: {[Op.iLike]: `%${nombre}%`}
    },
  })
  return res.send(JSON.parse(JSON.stringify(producto)))

})

router.get('/ProductosAllBotica/:id', async (req, res) => { //Todos los productos de una botica
  try {
    const productosDetalles = await ProductoDetalle.findAll({
      where:{
        boticaID : req.params.id
      },
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
          attributes: ['nombre', 'direccion'], 
        }
      ],
      order: [['id', 'ASC']] 
    });

    return res.status(200).send({ ProductosDetalles: JSON.parse(JSON.stringify(productosDetalles)) });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


router.get('/stockProductosAll', async (req, res) => {
  const { categoria } = req.query;

    try {
      const stockProductos = await StockProducto.findAll({
        include: [
          {
            model: Producto,
            include: [
              {
                model: Marca,
                attributes: ['id', 'nombre'] 
              },
              {
                model: Botica,
                attributes: ['id', 'nombre', 'direccion','estado'] 
              }
            ],
            attributes: ['id', 'nombre','presentacion', 'imageUrl'],
            where: categoria ? { categoria: { [Op.contains]: [categoria] } } : {},
          }
        ]
      });
  
      res.json(stockProductos); 
    } catch (error) {
      console.error("Error al obtener los stockproductos:", error);
      res.status(500).json({ error: "Error al obtener los stockproductos" });
    }
  });

  
  router.get('/stockProductos/:id', async (req, res) => {
    const { id } = req.params; // Obtenemos el id de los parámetros de la URL
    try {
      const stockProducto = await ProductoDetalle.findByPk(id, { // Usamos findByPk para buscar por la clave primaria
        include: [
          {
            model: Producto,
            include: [
              {
                model: Marca,
                attributes: ['id', 'nombre']
              },
              
            ],
            attributes: ['id', 'nombre', 'presentacion', 'categoria', 'nRegistroSanitario','fechaRegistro']
          },
          {
            model: Botica,
            attributes: ['id', 'nombre', 'direccion','estado']
          }
        ]
      });
  
      if (stockProducto) {
        res.json(stockProducto); // Devolvemos el producto si se encuentra
      } else {
        res.status(404).json({ error: 'StockProducto no encontrado' }); // Si no se encuentra, devolver 404
      }
    } catch (error) {
      console.error('Error al obtener el stockProducto:', error);
      res.status(500).json({ error: 'Error al obtener el stockProducto' });
    }
  });
  

  //EndPoint para traer todos los Productos registrados en la base de Datos 
  router.get('/productos', async (req, res) => {
    try {
      // Obtenemos todos los productos de la base de datos
      const productos = await Producto.findAll();
      
      // Si no hay productos, devolvemos un mensaje de error
      if (productos.length === 0) {
        return res.status(404).json({ message: "No se encontraron productos." });
      }
  
      // Devolvemos los productos como respuesta JSON
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: "Error al obtener los productos", error });
    }
  });
  

router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;

    // Obtenemos los productos, sus detalles asociados, y datos de Marca y Botica
    const productos = await Producto.findAll({
      where: {
        categoria: {
          [Op.contains]: [categoria],
        },
      },
      include: [
        {
          model: ProductoDetalle,
          as: 'ProductoDetalle',
          attributes: ['descripcion', 'caracteristicas', 'imageUrl', 'cantidad', 'precio'],
          include: [
            {
              model: Botica, // Incluye datos de Botica desde ProductoDetalle
              attributes: ['nombre', 'direccion', 'horarioAbre', 'horarioCierre'],
            },
          ],
        },
        {
          model: Marca, // Incluye datos de Marca directamente desde Producto
          attributes: ['nombre'],
        },
      ],
    });

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener los productos por categoría:", error);
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
});




router.get('/masVendidos', async (req, res) => {
  try {
      // Consultar los productos más vendidos agrupando por productoDetalleID
      const productosMasVendidos = await ProductoOrden.findAll({
          attributes: [
              'productoDetalleID',
              [
                  ProductoOrden.sequelize.fn(
                      'SUM',
                      ProductoOrden.sequelize.col('ProductoOrden.cantidad') // Cantidad total vendida
                  ),
                  'totalVendido'
              ]
          ],
          include: [
              {
                  model: ProductoDetalle,
                  as: 'ProductoDetalle',
                  attributes: ['precio', 'imageUrl', 'productoID', 'boticaID'],
                  include: [
                      {
                          model: Producto,
                          as: 'Producto',
                          attributes: ['nombre']
                      },
                      {
                          model: Botica,
                          as: 'Botica',
                          attributes: ['nombre']
                      }
                  ]
              }
          ],
          group: [
              'ProductoOrden.productoDetalleID',
              'ProductoDetalle.id',
              'ProductoDetalle->Producto.id',
              'ProductoDetalle->Botica.id'
          ],
          order: [
              [
                  ProductoOrden.sequelize.fn(
                      'SUM',
                      ProductoOrden.sequelize.col('ProductoOrden.cantidad')
                  ),
                  'DESC'
              ]
          ],
          limit: 10
      });

      // Mapeo de resultados para devolver una respuesta más legible
      const productos = productosMasVendidos.map(item => ({
          productoDetalleID: item.productoDetalleID,
          nombre: item.ProductoDetalle.Producto.nombre,
          imageUrl: item.ProductoDetalle.imageUrl,
          precio: item.ProductoDetalle.precio,
          totalVendido: parseInt(item.dataValues.totalVendido, 10),
          botica: item.ProductoDetalle.Botica.nombre
      }));

      res.status(200).json(productos);
  } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
  }
});








  


  
  
  



export default router;
