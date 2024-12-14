import { app } from '../index.js';
import request from 'supertest';
import { Producto } from '../Models/Relaciones.js';

jest.mock('../Models/Relaciones');


describe("Pruebas para el endpoint /newProductos", () => {
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

    it("Debe crear un nuevo producto si no existe", async () => {
      const datosProducto = {
        nombre: "Producto A",
        presentacion: "Caja",
        registroSanitario: "RS12345",
        categorias: ["Categoría 1"],
        marcaID: 1,
      };
  

      Producto.create = jest.fn().mockResolvedValue(datosProducto);
      Producto.findOne = jest.fn().mockResolvedValue(null); 

  
      const response = await request(app)
        .post("/api/productos/newProductos")
        .send(datosProducto);
  
      expect(response.status).toBe(201);
      expect(response.body.Mensaje).toBe("Producto creado exitosamente");
      expect(response.body.Producto).toEqual(datosProducto); 
    });
  
    it("Debe devolver un error 409 si el producto ya existe", async () => {
      const datosProductoExistente = {
        nombre: "Producto A",
        presentacion: "Caja",
        registroSanitario: "RS12345",
        categorias: ["Categoría 1"],
        marcaID: 1,
      };
  

      Producto.findOne = jest.fn().mockResolvedValue(datosProductoExistente);
  
      const response = await request(app)
        .post("/api/productos/newProductos")
        .send(datosProductoExistente);
  
      expect(response.status).toBe(409);
      expect(response.body.Mensaje).toBe("Producto existente");
      expect(response.body.Producto).toEqual(datosProductoExistente); 
    });
  
    it("Debe devolver un error 500 si ocurre un problema inesperado", async () => {
      const datosProducto = {
        nombre: "Producto ",
        presentacion: "Caja",
        registroSanitario: "RS1212",
        categorias: ["Categoría 1"],
        marcaID: 1
      };
      
      Producto.findOne = jest.fn().mockResolvedValue(null);

      Producto.create = jest.fn().mockRejectedValue(new Error("Error inesperado"));
  
      const response = await request(app)
        .post("/api/productos/newProductos")
        .send(datosProducto);
  
      expect(response.status).toBe(500);
      expect(response.text).toBe("Error al crear producto"); 
    });
  });
  