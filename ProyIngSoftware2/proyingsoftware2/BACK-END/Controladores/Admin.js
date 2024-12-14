import express from "express";
import { Admin, Producto , Marca, ProductoDetalle,Botica} from "../Models/Relaciones.js";



const router = express.Router();


router.post('/iniciarSesion', async (req, res) => {
    const { correo, password } = req.body;
  
    try {
      
      const admin = await Admin.findOne({ where: { correo: correo.toLowerCase() } });
  
      // Si no se encuentra el administrador
      if (!admin) {
        return res.status(401).json({ message: 'Credenciales inválidas. Administrador no encontrado.' });
      }
      
      // Verificar si el estado es false
      if (!admin.estado) {
        return res.status(403).json({ message: 'Tu cuenta está inactiva. Por favor, contacta al soporte.' });
      }
  
      // Compara la contraseña 
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Credenciales inválidas. Contraseña incorrecta.' });
      }
  
      
      return res.json({
        message: 'Inicio de sesión exitoso',
        admin: {
          id: admin.boticaID,
          nombre: admin.nombre,
          apellidoPaterno: admin.apellidoPaterno,
        },
      });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return res.status(500).json({ message: 'Error en el servidor. Inténtalo nuevamente más tarde.' });
    }
  });
  
  router.get('/boticaProductos/:boticaID', async (req, res) => {
    const { boticaID } = req.params;
    try {
        const productos = await ProductoDetalle.findAll({
            where: { boticaID },
            include: [
                {
                    model: Producto,
                    attributes: ['id','nombre', 'presentacion', 'categoria', 'nRegistroSanitario'],
                    include:[
                      {
                        model: Marca,
                        attributes: ['id', 'nombre'],
                      },
                    ]
                },
            ]
        });
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get('/administradores', async (req, res) => {
  const { boticaID } = req.query; 

  try {
      const whereClause = boticaID ? { boticaID: boticaID } : {}; // 

      const administradores = await Admin.findAll({
          where: whereClause,
          include: {
              model: Botica,
              attributes: ['nombre'],
              required: false
          }
      });

      if (administradores.length === 0) {
          return res.status(404).json({ mensaje: 'No se encontraron administradores' });
      }

      const resultado = administradores.map(admin => ({
          nombre: admin.nombre,
          apellidoPaterno: admin.apellidoPaterno,
          apellidoMaterno: admin.apellidoMaterno,
          botica: admin.Botica ? admin.Botica.nombre : 'Sin botica'
      }));

      res.status(200).json(resultado);
  } catch (error) {
      console.error('Error al obtener administradores:', error);
      res.status(500).json({ mensaje: 'Error al obtener administradores', error: error.message });
  }
});




router.post('/registrar', async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, correo, password, dni, boticaID } = req.body;

  if (!boticaID) {
      return res.status(400).json({ message: "El ID de la botica es obligatorio" });
  }

  try {
      const nuevoAdmin = await Admin.create({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          correo,
          password,
          dni,
          boticaID,
      });

      res.status(201).json({ message: "Administrador registrado exitosamente", admin: nuevoAdmin });
  } catch (error) {
      console.error("Error al registrar el administrador:", error);
      res.status(500).json({ message: "Error al registrar el administrador", error: error.message });
  }
});

router.put('/cambiarEstado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await ProductoDetalle.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'ProductoDetalle no encontrado' });
    }

    // Cambiar el estado del producto de true a false o viceversa
    await producto.update({ estado: !producto.estado });

    return res.json({ message: 'Estado del producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del producto:', error);
    return res.status(500).json({ message: 'Error en el servidor. Inténtalo nuevamente más tarde.' });
  }
});

router.put('/cambiarStock', async (req, res) => {
  const { id, stock } = req.query;
  

  try {
    console.log(id)
    const producto = await ProductoDetalle.findByPk(id);
    console.log(producto)

    if (!producto) {
      return res.status(404).json({ message: 'ProductoDetalle no encontrado' });
    }

    // Cambiar el estado del producto de true a false o viceversa
    await producto.update({ cantidad: stock });
    await producto.save()

    return res.send(JSON.parse(JSON.stringify(producto)));
  } catch (error) {
    console.error('Error al actualizar el Stock del producto:', error);
    return res.status(500).json({ message: 'Error en el servidor. Inténtalo nuevamente más tarde.' });
  }
});




router.get('/verificarCorreoAdmin/:correo', async (req, res) => {
  const { correo } = req.params; 

  try {
    const admin = await Admin.findOne({ where: { correo } }); 

    if (admin) {
      return res.status(200).json({ message: 'El correo existe' }); 
    } else {
      return res.status(404).json({ message: 'El correo no existe' }); 
    }
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    return res.status(500).json({ message: 'Ocurrió un error al verificar el correo.' });
  }
});


router.put('/restablecerContrasenaAdmin', async (req, res) => {
  const { correo, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { correo } });
    if (admin) {
      
      admin.password = password; 
      await admin.save(); 
      
      return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } else {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error); // Log de error
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
