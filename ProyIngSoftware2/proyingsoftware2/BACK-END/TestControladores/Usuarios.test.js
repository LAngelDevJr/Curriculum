import { app } from '../index.js';
import request from 'supertest';
import { Usuario } from '../Models/Relaciones';
import NodeCache from "node-cache";
import Transporter from "../Services/mail.service";

jest.mock('../Models/Relaciones');
jest.mock('../Services/mail.service');

// Mock para node-cache
jest.mock("node-cache", () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
  }));
});

describe("Pruebas para el endpoint /restablecerContrasena", () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001, () => {
      console.log('Servidor de prueba escuchando en el puerto 4001');
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    Usuario.findOne.mockReset();
  });

  it("Debe actualizar la contraseña exitosamente si el correo existe", async () => {
    const mockUsuario = {
      id: 1,
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
      correo: "juan@example.com",
      password: "123456",
      estado: true,
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);
    Usuario.prototype.save = jest.fn().mockResolvedValue(mockUsuario); // Mock para el método save()

    const response = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ correo: "juan@example.com", password: "newpassword123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contraseña actualizada con éxito");
    expect(Usuario.prototype.save).toHaveBeenCalledTimes(1);
  });

  it("Debe devolver un error 404 si el correo no existe", async () => {
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ correo: "noexiste@example.com", password: "newpassword123" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Correo no encontrado");
  });

  it("Debe devolver un error 400 si falta el correo o la contraseña", async () => {
    const response = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ correo: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Correo y contraseña son requeridos");

    const response2 = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ password: "newpassword123" });

    expect(response2.status).toBe(400);
    expect(response2.body.message).toBe("Correo y contraseña son requeridos");
  });

  it("Debe devolver un error 400 si el formato del correo es inválido", async () => {
    const response = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ correo: "correo_invalido", password: "newpassword123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de correo inválido");
  });

  it("Debe devolver un error 500 si ocurre un problema en el servidor", async () => {
    Usuario.findOne.mockImplementation(() => {
      throw new Error("Error inesperado");
    });

    const response = await request(app)
      .put("/api/usuarios/restablecerContrasena")
      .send({ correo: "juan@example.com", password: "newpassword123" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error en el servidor");
  });
});

describe("Pruebas para el endpoint /registrar", () => {
  let server;
  let cacheMock;
  beforeAll(() => {
    server = app.listen(4001, () => {
      console.log('Servidor de prueba escuchando en el puerto 4001');
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeAll(() => {
    // Configuramos el mock de NodeCache
    cacheMock = {
      set: jest.fn(),
      get: jest.fn(),
    };
    NodeCache.mockImplementation(() => cacheMock);
  });

  it("Debe enviar un código de verificación al correo y almacenar en caché", async () => {
    const datosUsuario = {
      correo: "juan@example.com",
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
    };

    // Mock para la respuesta del mail
    Transporter.sendMail.mockResolvedValue({});

    const response = await request(app)
      .post("/api/usuarios/registrar")
      .send(datosUsuario);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Se ha enviado un código de verificación a tu correo");
    expect(Transporter.sendMail).toHaveBeenCalledTimes(1); // Verifica que se envió el correo una vez
    expect(cacheMock.set).toHaveBeenCalledWith(datosUsuario.correo, expect.any(String)); // Verifica que el código fue almacenado
  });

  it("debería retornar un error si falta un campo requerido", async () => {
    const datosIncompletos = {
      apellidoPaterno: "Pérez",
      correo: "juan.perez@example.com",
      telefono: "987654321",
      dni: "12345678",
    };

    const response = await request(app).post("/api/usuarios/registrar").send(datosIncompletos);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("El campo 'nombre' es requerido");
  });

  it("debería retornar un error si el correo tiene formato inválido", async () => {
    const datosUsuario = {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      password: "123456",
      correo: "correo_invalido",
      telefono: "987654321",
      dni: "12345678",
    };

    const response = await request(app).post("/api/usuarios/registrar").send(datosUsuario);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de correo inválido");
  });

  it("debería retornar un error si el teléfono no tiene 9 dígitos", async () => {
    const datosUsuario = {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      password: "123456",
      correo: "juan.perez@example.com",
      telefono: "12345",
      dni: "12345678",
    };

    const response = await request(app).post("/api/usuarios/registrar").send(datosUsuario);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El campo 'telefono' debe tener 9 dígitos");
  });

  it("debería retornar un error si ocurre un problema con el envío de correos", async () => {
    // Mockeamos un error en el envío de correos
    Transporter.sendMail.mockImplementation((mailOptions, callback) => {
      callback(new Error("Error al enviar el correo"));
    });

    const datosUsuario = {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      password: "123456",
      correo: "juan.perez@example.com",
      telefono: "987654321",
      dni: "12345678",
    };

    const response = await request(app).post("/api/usuarios/registrar").send(datosUsuario);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error al enviar el correo de verificación");
  });

  it("Debe devolver un error 500 si ocurre un problema inesperado", async () => {
    const datosUsuario = {
      correo: "juan@example.com",
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
    };

    Transporter.sendMail.mockImplementation(() => {
      throw new Error("Error inesperado");
    });

    const response = await request(app)
      .post("/api/usuarios/registrar")
      .send(datosUsuario);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error al registrar usuario. Por favor, intenta nuevamente.");
  });

});

//Este esta cerrado
describe("Pruebas para el endpoint /iniciarSesion", () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001, () => {
      console.log('Servidor de prueba escuchando en el puerto 4001');
    });
  });
  beforeEach(() => {
    Usuario.findOne.mockReset();
  });

  afterAll((done) => {

    server.close(done);
  });

  it("Debe iniciar sesión exitosamente con credenciales correctas", async () => {
    // Mock del usuario válido
    const mockUsuario = {
      id: 1,
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
      correo: "juan@example.com",
      password: "123456",
      estado: true,
    };

    // Configurar el mock del modelo
    Usuario.findOne.mockResolvedValue(mockUsuario);

    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "juan@example.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Inicio de sesión exitoso");
    expect(response.body.user).toMatchObject({
      id: mockUsuario.id,
      nombre: mockUsuario.nombre,
      apellidoPaterno: mockUsuario.apellidoPaterno,
      apellidoMaterno: mockUsuario.apellidoMaterno,
      correo: mockUsuario.correo,
    });
  });

  it("Debe devolver un error si el usuario no existe", async () => {
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "noexiste@example.com", password: "123456" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  it("Debe devolver un error si la cuenta está inhabilitada", async () => {
    const mockUsuario = {
      id: 1,
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
      correo: "juan@example.com",
      password: "123456",
      estado: false,
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "juan@example.com", password: "123456" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Su cuenta ha sido inhabilitada. Por favor, contacte al soporte.");
  });

  it("Debe devolver un error si la contraseña es incorrecta", async () => {
    const mockUsuario = {
      id: 1,
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "López",
      correo: "juan@example.com",
      password: "123456",
      estado: true,
    };

    Usuario.findOne.mockResolvedValue(mockUsuario);

    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "juan@example.com", password: "incorrecta" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Contraseña incorrecta");
  });

  it("Debe devolver un error si faltan campos requeridos", async () => {
    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "" }); // Sin contraseña
  
    expect(response.status).toBe(400); 
    expect(response.body.message).toBe("Correo y contraseña son requeridos");
  });

  it("Debe devolver un error si el formato del correo es inválido", async () => {
    const response = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ correo: "correo_invalido", password: "123456" });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de correo inválido");
  });
  
});



/**
 * He creado .babelrc
 * He creado el jest.config.js
 * He ejecutado esto npm install --save-dev jest supertest cross-env
 * He ejecutado esto npm install --save-dev @babel/preset-env babel-jest
 * He ejecutado esto npm install --save-dev cross-env
 * 
 **/