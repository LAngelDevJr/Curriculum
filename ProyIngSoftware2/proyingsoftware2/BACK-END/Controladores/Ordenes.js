//aqui se realiza la paga
import express from "express"; 
import { Orden, Usuario,ProductoOrden ,Carrito, ProductoCarrito, Producto,ProductoDetalle,Botica } from '../Models/Relaciones.js';  // Asegúrate de importar StockProducto

const router = express.Router();
const TASA_IMPUESTO = 0.18;  // Representa el 18% de impuestos

router.get('/OrdenesAll', async(req,res)=>{
    try{
        const boticaID = req.query.boticaID
        const ordenes = await Orden.findAll({
            where:{
                boticaID: boticaID},
            include:
                {
                    model:Usuario,
                    attributes:['nombre','correo']
                },

                raw: true,
                nest: true,
        });
    const ordenesConUsuario = ordenes.map(orden => {
        const { Usuario, ...restOfOrden } = orden;  // Destructure to remove the nested Usuario object
        return {
            ...restOfOrden,  // Spread the other properties from the Orden model
            nombre: Usuario.nombre,  // Add the 'nombre' from Usuario
            correo: Usuario.correo,  // Add the 'correo' from Usuario
        };
    });

        return res.status(200).json(ordenesConUsuario);
    } catch (error){
        console.error("Error al obtener ordenes",error)
        return res.status(500).send("Error al obtener ordenes");
    }

})


router.get('/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;
    const baseUrl = `http://localhost:4000/images/`; // Cambia esto si tienes otra ruta de acceso a las imágenes

    try {
        // Buscar el carrito asociado al usuarioID
        const carrito = await Carrito.findOne({ where: { usuarioID } });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        const carritoID = carrito.id;

        // Buscar los productos en ProductoCarrito que correspondan al carrito
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID },
            attributes: ['cantidad'],
            include: [
                {
                    model: ProductoDetalle,
                    attributes: ['precio', 'imageUrl'], // Obtener el precio e imagen desde ProductoDetalle
                    include: [
                        {
                            model: Producto,
                            attributes: ['nombre'] // Obtener el nombre del producto
                        },
                        {
                            model: Botica,
                            attributes: ['nombre'], // Obtener el nombre de la botica
                        }
                    ]
                }
            ]
        });

        if (productosCarrito.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos en el carrito.' });
        }

        // Mapeamos los datos (nombre, precio, cantidad, imagen y botica)
        const productos = productosCarrito.map(item => ({
            nombre: item.ProductoDetalle.Producto.nombre,
            precio: item.ProductoDetalle.precio,
            cantidad: item.cantidad,
            imagen: item.ProductoDetalle.imageUrl ? `${baseUrl}${item.ProductoDetalle.imageUrl}` : null, // Agregar URL completa de imagen
            botica: item.ProductoDetalle.Botica ? item.ProductoDetalle.Botica.nombre : 'No especificada' // Nombre de la botica
        }));

        // Devolver los productos con nombre, precio, cantidad, imagen y nombre de la botica
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});

router.post('/crearOrden/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;
    const { direccionEnvio, metodoEntrega, botica } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(usuarioID);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ where: { usuarioID } });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado.' });
        }

        // Obtener los productos del carrito con la botica asociada
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID: carrito.id },
            include: [
                {
                    model: ProductoDetalle,
                    attributes: ['precio', 'boticaID'],
                    include: {
                        model: Producto,
                        attributes: ['nombre']
                    }
                }
            ]
        });

        // Agrupar productos por botica
        const productosPorBotica = {};
        productosCarrito.forEach(item => {
            const boticaID = item.ProductoDetalle.boticaID;
            if (!productosPorBotica[boticaID]) {
                productosPorBotica[boticaID] = [];
            }
            productosPorBotica[boticaID].push(item);
        });

        // Validación de campos requeridos
        if (metodoEntrega === 'entrega' && !direccionEnvio) {
            return res.status(400).json({ mensaje: 'Debe proporcionar una dirección para la entrega a domicilio.' });
        }
        if (metodoEntrega === 'recojo' && !botica) {
            return res.status(400).json({ mensaje: 'Debe seleccionar una botica para el recojo en tienda.' });
        }

        // Crear una orden por cada botica
        const ordenesCreadas = [];
        for (const [boticaID, productos] of Object.entries(productosPorBotica)) {
            // Calcular el subtotal para esta botica
            const subtotal = productos.reduce((total, item) => {
                return total + item.ProductoDetalle.precio * item.cantidad;
            }, 0);

            // Determinar el costo de envío
            const costoEnvio = metodoEntrega === 'entrega' ? 10 : 0;

            // Calcular el impuesto (18%)
            const impuesto = (subtotal + costoEnvio) * TASA_IMPUESTO;
            const impuestoFinal = isNaN(impuesto) ? 0 : impuesto.toFixed(2);

            // Calcular el total
            const total = subtotal + costoEnvio + parseFloat(impuestoFinal);

            // Determinar la dirección final según el método de entrega
            const direccionFinal = metodoEntrega === 'recojo' ? `Recojo en ${botica}` : direccionEnvio;

            // Crear la nueva orden para esta botica
            const nuevaOrden = await Orden.create({
                estado: 'pendiente',
                direccionEnvio: direccionFinal,
                subtotal: subtotal.toFixed(2),
                costoEnvio: costoEnvio.toFixed(2),
                impuestos: impuestoFinal,
                total: total.toFixed(2),
                usuarioID: usuarioID,
                boticaID: parseInt(boticaID), // Asociar la orden a la botica
                fechaRegistro: new Date() // Fecha actual de creación
            });

            ordenesCreadas.push(nuevaOrden);
        }

        res.status(201).json({
            mensaje: 'Órdenes creadas exitosamente para cada botica.',
            ordenes: ordenesCreadas,
        });
    } catch (error) {
        console.error('Error al crear las órdenes:', error);
        res.status(500).json({ mensaje: 'Error al crear las órdenes.', detalles: error.message });
    }
});



router.post('/llenarProductoOrden/:usuarioID/:ordenID', async (req, res) => {
    const { usuarioID, ordenID } = req.params;

    try {
        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ where: { usuarioID } });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        // Obtener los productos del carrito del usuario
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID: carrito.id },
            include: [
                {
                    model: ProductoDetalle,
                    attributes: ['precio'],
                    include: {
                        model: Producto,
                        attributes: ['nombre']
                    }
                }
            ]
        });

        if (productosCarrito.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos en el carrito.' });
        }

        // Iterar sobre los productos del carrito y llenar la tabla ProductoOrden
        for (const item of productosCarrito) {
            const precioTotal = item.ProductoDetalle.precio * item.cantidad;

            await ProductoOrden.create({
                ordenID: ordenID,
                productoDetalleID: item.productoDetalleID,
                cantidad: item.cantidad,
                precio: item.ProductoDetalle.precio.toFixed(2),
                precioTotal: precioTotal.toFixed(2)
            });
        }

        res.status(201).json({ mensaje: 'ProductoOrden llenado con éxito.' });
    } catch (error) {
        console.error('Error al llenar ProductoOrden:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al llenar ProductoOrden.', detalles: error.message });
    }
});



router.put('/actualizarStockProductos/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;
  
    try {
        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ where: { usuarioID } });
        console.log('Carrito encontrado:', carrito);
  
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado.' });
        }
  
        // Obtener los productos del carrito
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID: carrito.id },
            include: [
                {
                    model: ProductoDetalle,  // Usar ProductoDetalle ya que contiene el stock
                    attributes: ['id', 'cantidad'], // Obtenemos la cantidad disponible en stock y el id
                    include: {
                        model: Producto,  // Incluimos Producto si necesitamos el nombre
                        attributes: ['nombre']
                    }
                }
            ]
        });
        console.log('Productos en carrito:', productosCarrito);
  
        // Verificar si el carrito tiene productos
        if (productosCarrito.length === 0) {
            return res.status(400).json({ mensaje: 'No hay productos en el carrito para actualizar el stock.' });
        }
  
        // Iterar sobre los productos del carrito y actualizar el stock
        for (let item of productosCarrito) {
            const stockProducto = item.ProductoDetalle;
            console.log('Stock del producto antes de actualización:', stockProducto);
  
            if (stockProducto) {
                // Restar la cantidad del producto comprado del stock actual
                const nuevaCantidad = stockProducto.cantidad - item.cantidad;
                console.log(`Producto: ${item.ProductoDetalle.Producto.nombre}, Stock actual: ${stockProducto.cantidad}, Cantidad a restar: ${item.cantidad}, Nueva cantidad: ${nuevaCantidad}`);
  
                // Verificar si hay stock suficiente
                if (nuevaCantidad < 0) {
                    return res.status(400).json({
                        mensaje: `No hay suficiente stock para el producto ${item.ProductoDetalle.Producto.nombre}. Stock disponible: ${stockProducto.cantidad}.`,
                    });
                }
  
                // Realizar la actualización de la cantidad en la base de datos
                const updateResult = await ProductoDetalle.update(
                    { cantidad: nuevaCantidad }, 
                    { where: { id: stockProducto.id } }
                );
  
                console.log(`Resultado de la actualización del producto con ID ${stockProducto.id}:`, updateResult);
            } else {
                return res.status(404).json({
                    mensaje: `No se encontró el producto con ID: ${item.productoDetalleID} en el stock.`,
                });
            }
        }
  
        res.status(200).json({ mensaje: 'Stock actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el stock:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.', detalles: error.message });
    }
  });
  

router.delete('/eliminarCarrito/:usuarioID', async (req, res) => {
  const { usuarioID } = req.params;

  try {
      // Buscar el carrito del usuario
      const carrito = await Carrito.findOne({ where: { usuarioID } });

      if (!carrito) {
          return res.status(404).json({ mensaje: 'Carrito no encontrado.' });
      }

      // Eliminar todos los productos del carrito en ProductoCarrito
      await ProductoCarrito.destroy({ where: { carritoID: carrito.id } });

      res.status(200).json({ mensaje: 'Productos del carrito eliminados correctamente.' });
  } catch (error) {
      console.error('Error al eliminar los productos del carrito:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor.', detalles: error.message });
  }
});

// Endpoint para obtener todas las órdenes de un usuario específico
router.get('/ordenesUsuario/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;

    try {
        // Buscar todas las órdenes asociadas al usuarioID
        const ordenes = await Orden.findAll({
            where: { usuarioID },
            include: [
                {
                    model: ProductoOrden,
                    attributes: ['cantidad', 'precio'],
                    include: [
                        {
                            model: ProductoDetalle,
                            attributes: ['precio'],
                            include: {
                                model: Producto,
                                attributes: ['nombre']
                            }
                        }
                    ]
                }
            ]
        });

        if (ordenes.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron órdenes para este usuario.' });
        }

        // Estructurar la respuesta para cada orden
        const detallesOrdenes = ordenes.map(orden => ({
            id: orden.id,
            direccionEnvio: orden.direccionEnvio,
            estado: orden.estado,
            subtotal: orden.subtotal,
            costoEnvio: orden.costoEnvio,
            impuestos: orden.impuestos,
            total: orden.total,
            productos: orden.ProductoOrdens.map(item => ({
                nombre: item.ProductoDetalle.Producto.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                precioTotal: (item.cantidad * item.precio).toFixed(2)
            }))
        }));

        res.status(200).json(detallesOrdenes);
    } catch (error) {
        console.error('Error al obtener las órdenes del usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});



/////////---------------------------------------------------------------
router.get('/carrito/ingresoTotalPorBotica/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;

    try {
        // Buscar el carrito asociado al usuarioID
        const carrito = await Carrito.findOne({ where: { usuarioID } });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        // Obtener los productos en el carrito con su cantidad, precio y el boticaID
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID: carrito.id },
            attributes: ['productoDetalleID', 'cantidad', 'precio'],
            include: [
                {
                    model: ProductoDetalle,
                    attributes: ['boticaID'],
                    include: [
                        {
                            model: Botica, // Incluir la tabla Botica para obtener el nombre
                            attributes: ['nombre']
                        }
                    ]
                }
            ]
        });

        // Verificar si hay productos en el carrito
        if (productosCarrito.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos en el carrito.' });
        }

        // Calcular el ingreso total por botica
        const ingresosPorBotica = {};

        productosCarrito.forEach(item => {
            const nombreBotica = item.ProductoDetalle.Botica ? item.ProductoDetalle.Botica.nombre : 'Nombre no disponible';
            const ingresoProducto = item.precio * item.cantidad;

            if (!ingresosPorBotica[nombreBotica]) {
                ingresosPorBotica[nombreBotica] = 0;
            }

            ingresosPorBotica[nombreBotica] += ingresoProducto;
        });

        // Convertir el resultado a un array de objetos para la respuesta
        const resultado = Object.keys(ingresosPorBotica).map(nombreBotica => ({
            nombreBotica,
            ingresoTotal: ingresosPorBotica[nombreBotica].toFixed(2) // Formatear a 2 decimales
        }));

        res.status(200).json({ ingresosPorBotica: resultado });
    } catch (error) {
        console.error('Error al calcular el ingreso total por botica:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});




export default router;
