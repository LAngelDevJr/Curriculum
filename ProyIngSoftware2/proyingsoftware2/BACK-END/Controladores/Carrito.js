import express from 'express';
import {Carrito, ProductoCarrito,ProductoDetalle, Producto,Botica } from '../Models/Relaciones.js';  // Asegúrate de importar ProductoDetalle

const router = express.Router();

//usado
// Endpoint para crear un carrito para un usuario, si no existe
router.post('/crearCarritoSiNoExiste/:usuarioID', async (req, res) => {
    try {
        const { usuarioID } = req.params; // Obtener el usuarioID desde los parámetros de la URL

        // Buscar un carrito existente asociado al usuarioID
        let carrito = await Carrito.findOne({ where: { usuarioID: usuarioID } });

        if (!carrito) {
            // Si no existe el carrito, crear uno nuevo
            carrito = await Carrito.create({ usuarioID });
            return res.status(201).json({
                mensaje: 'Carrito creado exitosamente',
                carrito: carrito // Devolver el nuevo carrito con el ID y usuarioID
            });
        } else {
            // Si ya existe el carrito, devolver el carrito existente
            return res.status(200).json({
                mensaje: 'El carrito ya existe para este usuario',
                carrito: carrito
            });
        }
    
    } catch (error) {
        console.error('Error al crear o verificar el carrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

//llenar la tabla producto carrito
router.post('/agregarProductoCarrito', async (req, res) => {
    try {
        const { productoDetalleID, carritoID, cantidad } = req.body;

        // Verificar que todos los campos están presentes
        if (!productoDetalleID || !carritoID || !cantidad) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        // Verificar que el carrito existe
        const carrito = await Carrito.findByPk(carritoID);
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado.' });
        }

        // Verificar que el producto existe en ProductoDetalle y obtener el precio
        const productoDetalle = await ProductoDetalle.findByPk(productoDetalleID);
        if (!productoDetalle) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        const precio = productoDetalle.precio;  // Obtener el precio desde ProductoDetalle

        // Verificar si el producto ya existe en el carrito
        const existingProduct = await ProductoCarrito.findOne({
            where: {
                productoDetalleID,
                carritoID
            }
        });

        if (existingProduct) {
            // Si el producto ya existe, actualizar la cantidad
            existingProduct.cantidad += cantidad;
            await existingProduct.save();
            return res.status(200).json({
                mensaje: 'Cantidad actualizada en el carrito.',
                productoCarrito: existingProduct
            });
        } else {
            // Si no existe, agregarlo
            const productoCarrito = await ProductoCarrito.create({
                productoDetalleID,
                carritoID,
                cantidad,
                precio  // Precio obtenido desde ProductoDetalle
            });

            return res.status(201).json({
                mensaje: 'Producto agregado al carrito correctamente',
                productoCarrito
            });
        }

    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({
            mensaje: 'Error al agregar el producto al carrito. Por favor, intenta nuevamente más tarde.',
            detalles: error.message
        });
    }
});


//usado
router.get('/productos/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;  // Obtener el usuarioID desde los parámetros de la URL
    const baseUrl = `http://localhost:4000/api/productoDetalle/`;  // La URL base para las imágenes

    try {
        // Buscar el carrito asociado al usuarioID
        const carrito = await Carrito.findOne({ where: { usuarioID } });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        // Buscar los productos en ProductoCarrito que correspondan al carrito encontrado
        const productosCarrito = await ProductoCarrito.findAll({
            where: { carritoID: carrito.id },
            include: [
                {
                    model: ProductoDetalle,
                    include: [
                        {
                            model: Producto,  // Relación con Producto para obtener el nombre
                            attributes: ['nombre']
                        }
                    ],
                    attributes: ['precio', 'imageUrl', 'boticaID', 'estado'],  // Incluir 'estado' en los atributos obtenidos desde ProductoDetalle
                }
            ]
        });

        // Si no hay productos en el carrito
        if (!productosCarrito || productosCarrito.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos en el carrito.' });
        }

        // Obtener los IDs únicos de las boticas para optimizar la consulta a la tabla Botica
        const boticaIDs = [...new Set(productosCarrito.map(item => item.ProductoDetalle.boticaID))];
        
        // Obtener los nombres de las boticas usando los IDs obtenidos
        const boticas = await Botica.findAll({
            where: { id: boticaIDs },
            attributes: ['id', 'nombre']
        });

        // Crear un diccionario para mapear cada boticaID a su nombre
        const boticaMap = boticas.reduce((acc, botica) => {
            acc[botica.id] = botica.nombre;
            return acc;
        }, {});

        // Mapeamos los datos a la estructura deseada
        const respuesta = productosCarrito.map(item => ({
            productoID: item.productoDetalleID,  // Incluimos la ID del productoDetalle
            nombre: item.ProductoDetalle.Producto.nombre,  // Obtener el nombre desde Producto
            imagen: item.ProductoDetalle.imageUrl ? `${baseUrl}${item.ProductoDetalle.imageUrl}` : null,  // Construir la URL completa usando baseUrl
            precio: item.ProductoDetalle.precio,  // Obtener el precio desde ProductoDetalle
            cantidad: item.cantidad,  // Cantidad desde ProductoCarrito
            subtotal: (item.ProductoDetalle.precio * item.cantidad).toFixed(2),  // Calcular subtotal
            botica: boticaMap[item.ProductoDetalle.boticaID] || 'Botica no encontrada',  // Obtener el nombre de la botica usando el diccionario
            estado: item.ProductoDetalle.estado  // Incluir el estado del producto
        }));

        // Enviar la respuesta en formato JSON
        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});





// En tu archivo de rutas de carrito.js Usandose
//usado
router.delete('/eliminarProducto/:usuarioID/:productoID', async (req, res) => {
    const { usuarioID, productoID } = req.params;  // Usar productoID en lugar de productoDetalleID

    try {
        // Encuentra el carrito del usuario
        const carrito = await Carrito.findOne({
            where: { usuarioID }
        });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para el usuario.' });
        }

        // Busca el producto en el carrito
        const productoEnCarrito = await ProductoCarrito.findOne({
            where: {
                carritoID: carrito.id,  // Usar el ID del carrito encontrado
                productoDetalleID: productoID  // Usar productoID para encontrar el producto correcto
            }
        });

        if (!productoEnCarrito) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito.' });
        }

        // Elimina el producto del carrito
        await ProductoCarrito.destroy({
            where: {
                carritoID: carrito.id,  // Eliminar en base al carritoID
                productoDetalleID: productoID  // Y productoID (productoDetalleID)
            }
        });

        res.status(200).json({ mensaje: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});





//usado para la imagen de carrito de compras
router.get('/cantidadProductos/:usuarioID', async (req, res) => {
    const { usuarioID } = req.params;

    try {
        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ where: { usuarioID } });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        // Obtener los productos del carrito
        const productosCarrito = await ProductoCarrito.findAll({ where: { carritoID: carrito.id } });

        // Calcular la cantidad total de productos
        const totalProductos = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);

        res.status(200).json({ totalProductos });
    } catch (error) {
        console.error('Error al obtener la cantidad de productos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});




//usado
router.put('/actualizarCantidad/:usuarioID/:productoID', async (req, res) => {
    const { usuarioID, productoID } = req.params;  // Obtener los IDs de los parámetros
    const { accion } = req.body;  // Obtener la acción (incrementar o decrementar) desde el cuerpo de la solicitud

    try {
        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ where: { usuarioID } });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario.' });
        }

        // Buscar el producto en el carrito
        const productoEnCarrito = await ProductoCarrito.findOne({
            where: {
                carritoID: carrito.id,  // Usar el ID del carrito encontrado
                productoDetalleID: productoID  // Asegúrate de usar la columna correcta, asumo que es productoDetalleID
            }
        });

        if (!productoEnCarrito) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito.' });
        }

        // Incrementar o decrementar la cantidad según la acción
        if (accion === 'incrementar') {
            productoEnCarrito.cantidad += 1;
        } else if (accion === 'decrementar') {
            // Evitar que la cantidad sea menor a 1
            if (productoEnCarrito.cantidad > 1) {
                productoEnCarrito.cantidad -= 1;
            } else {
                return res.status(400).json({ mensaje: 'La cantidad no puede ser menor a 1.' });
            }
        } else {
            return res.status(400).json({ mensaje: 'Acción no válida. Debe ser "incrementar" o "decrementar".' });
        }

        // Guardar los cambios
        await productoEnCarrito.save();

        // Responder con la nueva cantidad
        res.status(200).json({ mensaje: 'Cantidad actualizada correctamente.', nuevaCantidad: productoEnCarrito.cantidad });
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.', detalles: error.message });
    }
});





export default router;
