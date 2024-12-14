import {app} from '../index.js';
import request from 'supertest'
import {Orden} from '../Models/Relaciones';
/*
describe('Pruebas para el endpoint /ingresosBotica/:boticaID/:fecha', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(4001, () => {
            console.log('Servidor de prueba escuchando en el puerto 4001');
        });
    });

    afterAll(async () => {
        await server.close();
    });

    it('Debe devolver ingresos y cantidad de órdenes para una botica en una fecha existente', async () => {
        const response = await request(app).get('/api/botica/ingresosBotica/1/2024-11-03');

        console.log('Respuesta recibida:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('boticaID', '1');
        expect(response.body).toHaveProperty('fecha', '2024-11-03');
        expect(response.body).toHaveProperty('cantidadOrdenes');
        expect(typeof response.body.cantidadOrdenes).toBe('number');
        expect(response.body).toHaveProperty('ingresosTotales');
        expect(typeof response.body.ingresosTotales).toBe('string');
        expect(parseFloat(response.body.ingresosTotales)).toBeGreaterThan(0); 
    });

    it('Debe devolver un mensaje 404 si no se encuentran órdenes para la fecha y botica proporcionadas', async () => {
        const response = await request(app).get('/api/botica/ingresosBotica/1/2024-01-01');

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('mensaje', 'No se encontraron órdenes para esta botica en la fecha especificada.');
    });

    it('Debe devolver un mensaje 500 si ocurre un error interno del servidor', async () => {
        jest.spyOn(Orden, 'findAll').mockImplementationOnce(() => {
            throw new Error('Error simulado en la base de datos');
        });

        const response = await request(app).get('/api/botica/ingresosBotica/1/2024-11-03');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('mensaje', 'Error interno del servidor');
        expect(response.body).toHaveProperty('detalles', 'Error simulado en la base de datos');
    });
});*/