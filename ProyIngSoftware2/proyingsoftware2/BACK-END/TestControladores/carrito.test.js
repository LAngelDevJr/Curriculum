import { app } from '../index.js';
import request from 'supertest';
import { Carrito, ProductoCarrito, ProductoDetalle, Producto, Botica } from '../Models/Relaciones.js';

const testPort = 4001;

describe('Pruebas unitarias para los endpoints del carrito', () => {
  let server;

  beforeAll(() => {
    server = app.listen(testPort, () => {
      console.log(`Servidor de prueba escuchando en el puerto ${testPort}`);
    });
  });

  afterAll(async () => {
    await server.close();
  });

  // Mock para evitar interacciones reales con la base de datos
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe crear un carrito si no existe', async () => {
    const mockCarrito = { id: 1, usuarioID: 123 };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(null);
    jest.spyOn(Carrito, 'create').mockResolvedValue(mockCarrito);

    const response = await request(app).post('/api/carrito/crearCarritoSiNoExiste/123');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      mensaje: 'Carrito creado exitosamente',
      carrito: mockCarrito,
    });

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 123 } });
    expect(Carrito.create).toHaveBeenCalledWith({ usuarioID: 123 });
  });

  it('Debe devolver un carrito existente', async () => {
    const mockCarrito = { id: 1, usuarioID: 123 };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);

    const response = await request(app).post('/api/carrito/crearCarritoSiNoExiste/123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mensaje: 'El carrito ya existe para este usuario',
      carrito: mockCarrito,
    });

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 123 } });
  });

  it('Debe agregar un producto al carrito', async () => {
    const mockProductoDetalle = { id: 1, precio: 10.5 };
    const mockCarrito = { id: 1, usuarioID: 123 };
    const mockProductoCarrito = { id: 1, productoDetalleID: 1, carritoID: 1, cantidad: 1, precio: 10.5 };

    jest.spyOn(Carrito, 'findByPk').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoDetalle, 'findByPk').mockResolvedValue(mockProductoDetalle);
    jest.spyOn(ProductoCarrito, 'findOne').mockResolvedValue(null);
    jest.spyOn(ProductoCarrito, 'create').mockResolvedValue(mockProductoCarrito);

    const response = await request(app).post('/api/carrito/agregarProductoCarrito').send({
      productoDetalleID: 1,
      carritoID: 1,
      cantidad: 1,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      mensaje: 'Producto agregado al carrito correctamente',
      productoCarrito: mockProductoCarrito,
    });

    expect(Carrito.findByPk).toHaveBeenCalledWith(1);
    expect(ProductoDetalle.findByPk).toHaveBeenCalledWith(1);
    expect(ProductoCarrito.findOne).toHaveBeenCalledWith({
      where: {
        productoDetalleID: 1,
        carritoID: 1,
      },
    });
    expect(ProductoCarrito.create).toHaveBeenCalledWith({
      productoDetalleID: 1,
      carritoID: 1,
      cantidad: 1,
      precio: 10.5,
    });
  });

  it('Debe devolver los productos del carrito', async () => {
    const mockCarrito = { id: 1, usuarioID: 123 };
    const mockProductosCarrito = [
      {
        productoDetalleID: 1,
        ProductoDetalle: {
          Producto: { nombre: 'Producto 1' },
          precio: 10.5,
          imageUrl: 'producto1.jpg',
          boticaID: 1,
          estado: true,
        },
        cantidad: 2,
      },
    ];
    const mockBotica = { id: 1, nombre: 'Botica Central' };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findAll').mockResolvedValue(mockProductosCarrito);
    jest.spyOn(Botica, 'findAll').mockResolvedValue([mockBotica]);

    const response = await request(app).get('/api/carrito/productos/123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        productoID: 1,
        nombre: 'Producto 1',
        imagen: 'http://localhost:4000/api/productoDetalle/producto1.jpg',
        precio: 10.5,
        cantidad: 2,
        subtotal: '21.00',
        botica: 'Botica Central',
        estado: true,
      },
    ]);

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 123 } });
    expect(ProductoCarrito.findAll).toHaveBeenCalledWith({
      where: { carritoID: 1 },
      include: expect.any(Array),
    });
    expect(Botica.findAll).toHaveBeenCalledWith({
      where: { id: [1] },
      attributes: ['id', 'nombre'],
    });
  });

  it('Debe eliminar un producto del carrito', async () => {
    const mockCarrito = { id: 1, usuarioID: 123 };
    const mockProductoCarrito = { id: 1, productoDetalleID: 1, carritoID: 1 };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findOne').mockResolvedValue(mockProductoCarrito);
    jest.spyOn(ProductoCarrito, 'destroy').mockResolvedValue(1);

    const response = await request(app).delete('/api/carrito/eliminarProducto/123/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ mensaje: 'Producto eliminado correctamente.' });

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 123 } });
    expect(ProductoCarrito.findOne).toHaveBeenCalledWith({
      where: {
        carritoID: 1,
        productoDetalleID: 1,
      },
    });
    expect(ProductoCarrito.destroy).toHaveBeenCalledWith({
      where: {
        carritoID: 1,
        productoDetalleID: 1,
      },
    });
  });

  it('Debe actualizar la cantidad de un producto en el carrito', async () => {
    const mockCarrito = { id: 1, usuarioID: 123 };
    const mockProductoCarrito = { id: 1, productoDetalleID: 1, carritoID: 1, cantidad: 1 };

    jest.spyOn(Carrito, 'findOne').mockResolvedValue(mockCarrito);
    jest.spyOn(ProductoCarrito, 'findOne').mockResolvedValue(mockProductoCarrito);

    const response = await request(app)
      .put('/api/carrito/actualizarCantidad/123/1')
      .send({ accion: 'incrementar' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mensaje: 'Cantidad actualizada correctamente.',
      nuevaCantidad: 2,
    });

    expect(Carrito.findOne).toHaveBeenCalledWith({ where: { usuarioID: 123 } });
    expect(ProductoCarrito.findOne).toHaveBeenCalledWith({
      where: {
        carritoID: 1,
        productoDetalleID: 1,
      },
    });

    expect(mockProductoCarrito.cantidad).toBe(2); // La cantidad se incrementó
  });
});
