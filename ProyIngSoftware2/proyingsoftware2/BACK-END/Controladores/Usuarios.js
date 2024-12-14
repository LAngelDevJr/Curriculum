import express from "express";
import { Orden, ProductoOrden, Producto, Usuario } from "../Models/Relaciones.js"; 
import crypto from "crypto";
import NodeCache from "node-cache";
import Transporter from "../Services/mail.service.js";

const router = express.Router();
// Endpoint para obtener a todos los usuarios registrados 
router.get("/", async (req, res) => {
    try {
        // Obtener todos los usuarios en la base de datos
        const usuarios = await Usuario.findAll();
        res.json(usuarios);  // Aqui se envian a todos los usuarios como respuesta
    } catch (error) { //Por si existe un error
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Obtener un usuario específico a partir de su ID
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuario = await Usuario.findByPk(id);
        
        if (usuario) {
            res.json(usuario); 
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar el usuario por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// Usamos un caché en memoria para almacenar códigos de verificación temporalmente
const myCache = new NodeCache({ stdTTL: 300 }); // Expira en 5 minutos (300 segundos)

router.post("/registrar", async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, password, correo, telefono, dni } = req.body;

    // Validaciones de los campos
    if (!nombre) return res.status(404).json({ message: "El campo 'nombre' es requerido" });
    if (!correo) return res.status(400).json({ message: "El campo 'correo' es requerido" });
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) return res.status(400).json({ message: "Formato de correo inválido" });
    if (!telefono || telefono.length !== 9) return res.status(400).json({ message: "El campo 'telefono' debe tener 9 dígitos" });
    if (!dni || dni.length !== 8) return res.status(400).json({ message: "El campo 'dni' debe tener 8 dígitos" });

    // Generar un código de verificación aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex"); // Genera un código de 6 dígitos

    console.log("Correo para verificación:", correo);
    // Almacenar el código de verificación en caché (por ejemplo, por correo)
    myCache.set(correo, verificationCode); // Asociamos el código con el correo
    // Verificar si el correo ya tiene un código de verificación en caché
    const existingCode = myCache.get(correo);
    console.log("Código existente en caché para este correo:", existingCode);

    // Configurar el correo de verificación
    const mailOptions = {
      from: "andriuchg14@gmail.com",
      to: correo, // El correo del usuario
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${verificationCode}`
    };

    // Enviar el correo
    await Transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error al enviar el correo de verificación"});
      }
      console.log("Correo enviado: " + info.response);

      res.status(201).json({
        mensaje: "Se ha enviado un código de verificación a tu correo",
      });
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      error: "Error al registrar usuario. Por favor, intenta nuevamente.",
      detalles: error.message
    });
  }
});

router.post("/verificarCodigo", async (req, res) => {
  const {nombre, apellidoPaterno, apellidoMaterno, password, codigo, correo, telefono, dni } = req.body;
  try {

    if (!codigo) {
      return res.status(400).json({ message: "El campo 'código' es requerido" });
    }
    // Obtener el código almacenado en la caché
    const storedCode = myCache.get(correo);
    // Depurar el valor de la clave almacenada en la caché
    console.log("Código almacenado en la caché:", storedCode);
    if (!storedCode) {
      return res.status(404).json({ message: "No se encontró un código de verificación para este correo" });
    }

    // Verificar el código
    if (storedCode !== codigo) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // El código es correcto, puedes realizar cualquier acción adicional
    // Ejemplo: Marcar al usuario como verificado en la base de datos si lo deseas.
    const nuevoUsuario = await Usuario.create({
      nombre, apellidoPaterno, apellidoMaterno, password, correo, telefono, dni
    });

    res.status(200).json({ message: "Correo verificado correctamente",
    usuario: nuevoUsuario });

    myCache.del(correo);

  } catch (error) {
    console.error("Error al verificar el código:", error);
    res.status(500).json({ error: "Error al verificar el código" });
  }
});


router.post('/iniciarSesion', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos" }); // Código 400 para mala solicitud
  }

  try {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      return res.status(400).json({ message: "Formato de correo inválido" }); // Código 400 para errores de formato
    }

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" }); // Código 404 si el usuario no existe
    }

    if (usuario.estado === false) {
      return res.status(403).json({ message: "Su cuenta ha sido inhabilitada. Por favor, contacte al soporte." }); // Código 403 para cuenta inhabilitada
    }

    if (password !== usuario.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" }); // Código 401 para contraseña incorrecta
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" }); // Código 500 para errores del servidor
  }
});

const cacheContraseña = new NodeCache({ stdTTL: 300 }); // Expira en 5 minutos (300 segundos)
// Endpoint para consultar a la base de datos si existe un correo (se utiliza para poder establecer nueva contraseña)
router.post('/verificarCorreo', async (req, res) => {
  const { correo } = req.body; // Obtenemos el correo del cuerpo de la solicitud
  console.log("Correo recibido:", correo); // Log para verificar que el correo se está recibiendo correctamente

  try {
    const usuario = await Usuario.findOne({ where: { correo } }); // Verifica si el usuario existe
    console.log("Usuario encontrado:", usuario); // Log para ver si el usuario existe

    if (!usuario) {
      return res.status(404).json({ message: 'El correo no existe' });
    }

    const codigoVerificación = crypto.randomBytes(3).toString("hex");
    cacheContraseña.set(correo, codigoVerificación); // Guardar el código en caché

    // Configuramos el correo a enviar al usuario
    const mail = {
      from: "andriuchg14@gmail.com",
      to: correo, // El correo del usuario
      subject: "Recuperación de cuenta",
      text: `Tu código para recuperar tu cuenta es: ${codigoVerificación}`
    };

    // Enviamos el correo
    await Transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error al enviar el correo' });
      } else {
        console.log("Correo enviado: " + info.response);
        return res.status(200).json({ message: 'El correo existe. Código enviado.' });
      }
    });
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    return res.status(500).json({ message: 'Ocurrió un error al verificar el correo.' });
  }
});

router.post('/codigoContrasenia', async (req, res) => {
  const {email,codigo } = req.body;

  try {
    // Obtén el código almacenado en caché
    console.log('Email:',email);
    console.log('Codigo:',codigo);
    const codigoGenerado = cacheContraseña.get(email);
    console.log('Código generado en caché:', codigoGenerado);
    if (!codigoGenerado) {
      return res.status(400).json({ message: 'Código expirado. Solicita uno nuevo.' });
    }

    if (codigoGenerado !== codigo) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    // Código válido, puedes borrar el código para evitar reutilización
    cacheContraseña.del(email);

    res.status(200).json({ message: 'Código verificado correctamente.' });
  } catch (error) {
    console.error('Error al verificar el código:', error);
    res.status(500).json({ message: 'Error al verificar el código.' });
  }
});

//Endpoint que nos va a permitir reestablecer una contraseña para un correo existente
router.put('/restablecerContrasena', async (req, res) => {
  const { correo, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { correo } });
    if (user) {
      // Actualiza la contraseña del usuario sin hash
      user.password = password; // Reemplaza la contraseña antigua con la nueva
      await user.save(); // Guarda los cambios
      
      return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } else {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error); // Log de error
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});


router.post('/:id/direcciones', async (req, res) => {
  const { id } = req.params;
  const { nuevaDireccion } = req.body;

  try {
      if (!nuevaDireccion || nuevaDireccion.trim().length === 0) {
          return res.status(400).json({ error: "La dirección no puede estar vacía" });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Agrega la nueva dirección al array de direcciones
      usuario.direcciones = [...(usuario.direcciones || []), nuevaDireccion];

      await usuario.save();
      res.json({ direcciones: usuario.direcciones });
  } catch (error) {
      console.error("Error al agregar dirección:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Endpoint para editar una dirección específica
router.put('/:id/direcciones/:index', async (req, res) => {
  const { id, index } = req.params;
  const { nuevaDireccion } = req.body;

  console.log(`Editar Dirección - Usuario ID: ${id}, Índice: ${index}, Nueva Dirección: ${nuevaDireccion}`);

  try {
      if (!nuevaDireccion || nuevaDireccion.trim().length === 0) {
          console.log("La dirección está vacía");
          return res.status(400).json({ error: "La dirección no puede estar vacía" });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
          console.log("Usuario no encontrado");
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const indexInt = parseInt(index, 10);
      if (isNaN(indexInt) || indexInt < 0 || indexInt >= usuario.direcciones.length) {
          console.log("Índice de dirección no válido");
          return res.status(400).json({ error: "Índice de dirección no válido" });
      }

      console.log("Antes de editar:", usuario.direcciones);

      // Actualizar la dirección
      usuario.direcciones[indexInt] = nuevaDireccion;
      await usuario.save();

      console.log("Después de editar:", usuario.direcciones);

      res.json({ direcciones: usuario.direcciones });
  } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});




// Endpoint para eliminar una dirección específica
router.delete('/:id/direcciones/:index', async (req, res) => {
  const { id, index } = req.params;

  console.log(`Eliminar Dirección - Usuario ID: ${id}, Índice: ${index}`);

  try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
          console.log("Usuario no encontrado");
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const indexInt = parseInt(index, 10);
      if (isNaN(indexInt) || indexInt < 0 || indexInt >= usuario.direcciones.length) {
          console.log("Índice de dirección no válido");
          return res.status(400).json({ error: "Índice de dirección no válido" });
      }

      console.log("Antes de eliminar:", usuario.direcciones);

      // Eliminar la dirección
      usuario.direcciones.splice(indexInt, 1);
      await usuario.save();

      console.log("Después de eliminar:", usuario.direcciones);

      res.json({ direcciones: usuario.direcciones });
  } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});






export default router;
