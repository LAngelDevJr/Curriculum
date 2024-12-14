import { app } from '../index.js';
import request from 'supertest';
import { ProductoDetalle } from '../Models/Relaciones.js';
import path from 'path';
jest.mock('../Models/Relaciones.js');

describe("Pruebas para el endpoint /newDetalle", () => {
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
    jest.clearAllMocks();
  });

  it("Debe agregar una nueva descripción si no existe", async () => {
    const datosDetalle = {
      boticaID: 1,
      productoID: 1,
      descripcion: "Descripción del producto",
      caracteristicas: "Características del producto",
      cantidad: 10,
      precio: 100,
    };


   const filePath = path.join(__dirname, 'assetsTest/ImagenPrueba.jpeg');

    ProductoDetalle.findOne = jest.fn().mockResolvedValue(null);
    ProductoDetalle.create = jest.fn().mockResolvedValue({
      ...datosDetalle,
      imageUrl: `/images/ImagenPrueba.jpeg`,
    });
    

    // Simulación del envío de formulario sin archivo
    const response = await request(app)
      .post("/api/productoDetalle/newDetalle")
      .field("boticaID", datosDetalle.boticaID)
      .field("productoID", datosDetalle.productoID)
      .field("descripcion", datosDetalle.descripcion)
      .field("caracteristicas", datosDetalle.caracteristicas)
      .field("cantidad", datosDetalle.cantidad)
      .field("precio", datosDetalle.precio)
      .attach('imagen', filePath);

    

    expect(response.status).toBe(201);
    expect(response.body.Mensaje).toBe("Descripcion agregada exitosamente");
    expect(response.body.Producto).toEqual(
      expect.objectContaining({
        ...datosDetalle,
        imageUrl: `/images/ImagenPrueba.jpeg`,
      })
    );
  });

  it("Debe devolver un error 409 si el detalle ya existe", async () => {
    const detalleExistente = {
      boticaID: 1,
      productoID: 1,
      descripcion: "Descripción existente",
      caracteristicas: "Características existentes",
      cantidad: 5,
      precio: 50,
      imageUrl: "/images/imagen_existente.jpg",
    };

    ProductoDetalle.findOne = jest.fn().mockResolvedValue(detalleExistente);

    const response = await request(app)
      .post("/api/productoDetalle/newDetalle")
      .field("boticaID", detalleExistente.boticaID)
      .field("productoID", detalleExistente.productoID)
      .field("descripcion", detalleExistente.descripcion)
      .field("caracteristicas", detalleExistente.caracteristicas)
      .field("cantidad", detalleExistente.cantidad)
      .field("precio", detalleExistente.precio);

    expect(response.status).toBe(409);
    expect(response.body.Mensaje).toBe("El producto ya tiene descripcion");
    expect(response.body.Producto).toEqual(detalleExistente);
  });

  it("Debe devolver un error 500 si ocurre un problema inesperado", async () => {
    const datosDetalle = {
      boticaID: 1,
      productoID: 1,
      descripcion: "Descripción del producto",
      caracteristicas: "Características del producto",
      cantidad: 10,
      precio: 100,
    };

    ProductoDetalle.findOne = jest.fn().mockResolvedValue(null);
    ProductoDetalle.create = jest.fn().mockRejectedValue(new Error("Error inesperado"));

    const response = await request(app)
      .post("/api/productoDetalle/newDetalle")
      .field("boticaID", datosDetalle.boticaID)
      .field("productoID", datosDetalle.productoID)
      .field("descripcion", datosDetalle.descripcion)
      .field("caracteristicas", datosDetalle.caracteristicas)
      .field("cantidad", datosDetalle.cantidad)
      .field("precio", datosDetalle.precio);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error al agregar detalle");
  });
});
