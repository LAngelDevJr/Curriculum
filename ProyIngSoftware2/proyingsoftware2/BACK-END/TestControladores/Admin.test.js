import { app } from '../index.js';
import request from 'supertest';
import { Admin } from '../Models/Relaciones.js';

const testPort = 4001;

// Aleksey Chávez
describe('Pruebas para el endpoint /api/admin/iniciarSesion', () => {
  let server;

  beforeAll(() => {
    server = app.listen(testPort, () => {
      console.log(`Servidor de prueba escuchando en el puerto ${testPort}`);
    });
  });

  afterAll(async () => {
    await server.close();
  });

  it('Debe devolver el código 200 y los datos del administrador cuando las credenciales son correctas', async () => {
    const mockAdmin = {
      id: 1,
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Sánchez',
      dni: '12345678',
      correo: 'juan.perez@botica.com',
      password: '123456',
      estado: true,
      boticaID: 1,
    };

    jest.spyOn(Admin, 'findOne').mockResolvedValue(mockAdmin);

    const response = await request(app).post('/api/admin/iniciarSesion').send({
      correo: 'juan.perez@botica.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Inicio de sesión exitoso',
      admin: {
        id: mockAdmin.boticaID,
        nombre: mockAdmin.nombre,
        apellidoPaterno: mockAdmin.apellidoPaterno,
      },
    });

    Admin.findOne.mockRestore();
  });

  it('Debe devolver el código 401 cuando el administrador no existe', async () => {
    jest.spyOn(Admin, 'findOne').mockResolvedValue(null);

    const response = await request(app).post('/api/admin/iniciarSesion').send({
      correo: 'inexistente@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: 'Credenciales inválidas. Administrador no encontrado.',
    });

    Admin.findOne.mockRestore();
  });

  it('Debe devolver el código 403 cuando el estado del administrador es inactivo', async () => {
    const mockAdmin = {
      id: 2,
      nombre: 'María',
      apellidoPaterno: 'López',
      apellidoMaterno: 'García',
      dni: '23456789',
      correo: 'maria.lopez@botica.com',
      password: 'password123',
      estado: false,
      boticaID: 2,
    };

    jest.spyOn(Admin, 'findOne').mockResolvedValue(mockAdmin);

    const response = await request(app).post('/api/admin/iniciarSesion').send({
      correo: 'maria.lopez@botica.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: 'Tu cuenta está inactiva. Por favor, contacta al soporte.',
    });

    Admin.findOne.mockRestore();
  });

  it('Debe devolver el código 401 cuando la contraseña es incorrecta', async () => {
    const mockAdmin = {
        id: 1,
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Sánchez',
        dni: '12345678',
        correo: 'juan.perez@botica.com',
        password: '123456',
        estado: true,
        boticaID: 1,
    };

    jest.spyOn(Admin, 'findOne').mockResolvedValue(mockAdmin);

    const response = await request(app).post('/api/admin/iniciarSesion').send({
      correo: 'juan.perez@botica.com',
      password: 'incorrecta',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: 'Credenciales inválidas. Contraseña incorrecta.',
    });

    Admin.findOne.mockRestore();
  });
});
