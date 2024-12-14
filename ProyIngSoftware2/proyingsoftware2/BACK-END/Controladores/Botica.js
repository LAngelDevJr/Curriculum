
import express from "express";
import {Orden, Marca, Botica, ProductoDetalle} from "../models/Relaciones.js";
import { Op } from "sequelize";



const router = express.Router();


router.get('/ingresosBotica/:boticaID/:fecha', async (req, res) => {
    const { boticaID, fecha } = req.params;
    console.log('Botica ID:', boticaID, 'Fecha:', fecha); // Añadir esta línea

    try {
        const ordenes = await Orden.findAll({
            where: {
                boticaID,
                fechaRegistro: {
                    [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`]
                }
            },
            attributes: ['total'],  
        });

        console.log('Órdenes encontradas:', ordenes); // Añadir esta línea

        if (ordenes.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron órdenes para esta botica en la fecha especificada.' });
        }

        const cantidadOrdenes = ordenes.length;
        const ingresosTotales = ordenes.reduce((sum, orden) => sum + parseFloat(orden.total), 0);

        res.status(200).json({
            boticaID,
            fecha: fecha.trim(), 
            cantidadOrdenes,
            ingresosTotales: ingresosTotales.toFixed(2)
        });
    } catch (error) {
        console.error('Error al obtener los ingresos de la botica:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});


router.post('/registrarBotica', async (req, res) => {
    const { 
        ruc, 
        nombre, 
        horarioAbre, 
        horarioCierre, 
        direccion, 
        direccion_latitude = null, // Valores por defecto nulos
        direccion_longitude = null 
    } = req.body;

    // Validación de campos obligatorios
    if (!ruc || !nombre || !horarioAbre || !horarioCierre || !direccion) {
        return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados.' });
    }

    try {
        // Crear una nueva instancia de Botica en la base de datos
        const nuevaBotica = await Botica.create({
            ruc,
            nombre,
            horarioAbre,
            horarioCierre,
            direccion,
            direccion_latitude,
            direccion_longitude
        });

        // Enviar la respuesta con los datos de la nueva botica creada
        res.status(201).json({
            mensaje: 'Botica registrada exitosamente.',
            botica: nuevaBotica
        });
    } catch (error) {
        console.error('Error al registrar la botica:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalles: error.message });
    }
});


export default router;
