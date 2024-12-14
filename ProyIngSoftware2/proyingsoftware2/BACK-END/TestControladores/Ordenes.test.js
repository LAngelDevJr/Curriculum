import { app } from '../index.js';
import request from 'supertest';
import {
  Orden,
  Usuario,
  ProductoOrden,
  Carrito,
  ProductoCarrito,
  ProductoDetalle,
  Producto,
  Botica,
} from '../Models/Relaciones.js';

const testPort = 4001;

describe('Pruebas unitarias para los endpoints de órdenes', () => {
  let server;

  beforeAll(() => {
    server = app.listen(testPort, () => {
      console.log(`Servidor de prueba escuchando en el puerto ${testPort}`);
    });
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe obtener todas las órdenes por boticaID con detalles del usuario', async () => {
    const mockOrdenes = [
      {
        id: 1,
        usuarioID: 1,
        boticaID: 1,
        Usuario: { nombre: 'Juan', correo: 'juan@example.com' },
      },
    ];

    jest.spyOn(Orden, 'findAll').mockResolvedValue(mockOrdenes);

    const response = await request(app).get('/api/ordenes/OrdenesAll?boticaID=1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        usuarioID: 1,
        boticaID: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
      },
    ]);

    expect(Orden.findAll).toHaveBeenCalledWith({
      where: { boticaID: 1 },
      include: { model: Usuario, attributes: ['nombre', 'correo'] },
      raw: true,
      nest: true,
    });
  });

  it('Debe devolver los productos del carrito de un usuario', async () => {
    const mockCarrito = { id: 1, usuarioID: 1 };
    const mockProductosCarrito = [
      {
        ProductoDetalle: {
          Producto: { nombre: 'Producto 1' },
          precio: 10.5,
          imageUrl: 'producto1.jpg',
          Botica: { nombre: 'Botica Central' },
        },
        cantidad: 2,
      },
    ];

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findAll').mockResolvedValue(mockProductosCarrito);

    const response = await request(app).get('/api/ordenes/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        nombre: 'Producto 1',
        precio: 10.5,
        cantidad: 2,
        imagen: 'http://localhost:4000/images/Amoxicilina500mg.jpg',
        botica: 'Botica Central',
      },
    ]);

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 1 } });
    expect(ProductoCarrito.findAll).toHaveBeenCalledWith({
      where: { carritoID: 1 },
      attributes: ['cantidad'],
      include: expect.any(Array),
    });
  });

  it('Debe crear órdenes por botica desde un carrito', async () => {
    const mockUsuario = { id: 1, nombre: 'Juan' };
    const mockCarrito = { id: 1, usuarioID: 1 };
    const mockProductosCarrito = [
      {
        cantidad: 2,
        ProductoDetalle: { precio: 10, boticaID: 1 },
      },
    ];
    const mockOrden = {
      id: 1,
      estado: 'pendiente',
      direccionEnvio: 'Calle Falsa 123',
      subtotal: '20.00',
      costoEnvio: '10.00',
      impuestos: '5.40',
      total: '35.40',
    };

    jest.spyOn(Usuario, 'findByPk').mockResolvedValue(mockUsuario);
    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findAll').mockResolvedValue(mockProductosCarrito);
    jest.spyOn(Orden, 'create').mockResolvedValue(mockOrden);

    const response = await request(app).post('/api/ordenes/crearOrden/1').send({
      direccionEnvio: 'Calle Falsa 123',
      metodoEntrega: 'entrega',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      mensaje: 'Órdenes creadas exitosamente para cada botica.',
      ordenes: [mockOrden],
    });

    expect(Orden.create).toHaveBeenCalledWith(expect.objectContaining({ total: '35.40' }));
  });

  it('Debe llenar la tabla ProductoOrden desde un carrito', async () => {
    const mockCarrito = { id: 1, usuarioID: 1 };
    const mockProductosCarrito = [
      {
        productoDetalleID: 1,
        cantidad: 2,
        ProductoDetalle: { precio: 10 },
      },
    ];

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findAll').mockResolvedValue(mockProductosCarrito);
    jest.spyOn(ProductoOrden, 'create').mockResolvedValue({});

    const response = await request(app).post('/api/ordenes/llenarProductoOrden/1/1');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ mensaje: 'ProductoOrden llenado con éxito.' });

    expect(ProductoOrden.create).toHaveBeenCalledWith(
      expect.objectContaining({ cantidad: 2, precio: '10.00' })
    );
  });

  it('Debe actualizar el stock de los productos al crear una orden', async () => {
    const mockCarrito = { id: 1, usuarioID: 1 };
    const mockProductosCarrito = [
      {
        cantidad: 2,
        ProductoDetalle: { id: 1, cantidad: 10, Producto: { nombre: 'Producto 1' } },
      },
    ];

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findAll').mockResolvedValue(mockProductosCarrito);
    jest.spyOn(ProductoDetalle, 'update').mockResolvedValue([1]);

    const response = await request(app).put('/api/ordenes/actualizarStockProductos/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ mensaje: 'Stock actualizado correctamente.' });

    expect(ProductoDetalle.update).toHaveBeenCalledWith(
      { cantidad: 8 },
      { where: { id: 1 } }
    );
  });

  it('Debe eliminar un carrito y sus productos asociados', async () => {
    const mockCarrito = { id: 1, usuarioID: 1 };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'destroy').mockResolvedValue(1);

    const response = await request(app).delete('/api/ordenes/eliminarCarrito/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ mensaje: 'Productos del carrito eliminados correctamente.' });

    expect(ProductoCarrito.destroy).toHaveBeenCalledWith({ where: { carritoID: 1 } });
  });
});
