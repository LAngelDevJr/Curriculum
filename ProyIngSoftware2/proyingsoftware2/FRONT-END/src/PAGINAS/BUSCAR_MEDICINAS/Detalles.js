import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Button, Link } from '@mui/material';
import Header1 from '../../COMPONENTES/Header_Principal';
import CantidadProducto from '../BUSCAR_MEDICINAS/DETALLES/Cantidad.js';
import { useNavigate, useParams } from 'react-router-dom';
import Header_Botica from '../../COMPONENTES/Header_Botica.js';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockProducto, setStockProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    async function fetchStockProducto() {
      try {
        const response = await fetch(`http://localhost:4000/api/productos/stockProductos/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del stockProducto');
        }
        const producto = await response.json();
        setStockProducto(producto);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchStockProducto();
  }, [id]);

  const handleAddToCart = async () => {
    if (stockProducto) {
        try {
            const usuario = JSON.parse(localStorage.getItem('user'));
            const usuarioID = usuario?.id;
            if (!usuarioID) {
                alert('No se encontró información del usuario. Por favor, inicia sesión.');
                return;
            }
            const responseCarrito = await fetch(`http://localhost:4000/api/carrito/crearCarritoSiNoExiste/${usuarioID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dataCarrito = await responseCarrito.json();
            if (!responseCarrito.ok) {
                alert('Error al verificar o crear el carrito.');
                return;
            }
            const carritoID = dataCarrito.carrito.id;
            console.log('Enviando datos al carrito:', {
                productoDetalleID: stockProducto.Producto.id,
                usuarioID: usuarioID,
                carritoID: carritoID,
                cantidad: cantidad,
            });
            const response = await fetch('http://localhost:4000/api/carrito/agregarProductoCarrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productoDetalleID: stockProducto.Producto.id,
                    carritoID: carritoID,
                    cantidad: cantidad,
                }),
            });
            if (response.ok) {
                const event = new Event('cartUpdated');
                window.dispatchEvent(event);
            } else {
                const errorData = await response.json();
                alert('Error al agregar el producto al carrito: ' + errorData.mensaje);
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            alert('Error al agregar el producto al carrito. Intente nuevamente.');
        }
    }
  };

  const aumentarCantidad = () => {
    if (cantidad < stockProducto.cantidad) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (!stockProducto) {
    return <div>No se encontró el Producto que está buscando.</div>;
  }

  if (stockProducto.estado === false) {
    return (
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4">Producto desactivado</Typography>
          <Typography variant="body1" color="textSecondary">
            Este producto no está disponible actualmente.
          </Typography>
        </Box>
      </Container>
    );
  }

  if(stockProducto.Botica.estado === false)
  {
    return (
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4">Botica Desactivada</Typography>
          <Typography variant="body1" color="textSecondary">
            Este producto no está disponible actualmente.
          </Typography>
        </Box>
      </Container>
    );
  }

  const imagenUrl = `http://localhost:4000/api/productoDetalle/${stockProducto.imageUrl}`;
  
  const admin = JSON.parse(localStorage.getItem('admin'));

  return (
    <>
      {admin ? <Header_Botica /> : <Header1 />}
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            {stockProducto.Producto.nombre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Marca: {stockProducto.Producto.Marca.nombre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Vendido por: {stockProducto.Botica.nombre}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              width="100%"
              height={300}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              }}
            >
              <img
                src={imagenUrl}
                alt={stockProducto.Producto.nombre}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                border={1}
                borderColor="black"
                borderRadius={8}
                p={3}
                textAlign="center"
                sx={{
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                }}
              >
                <Box borderBottom={1} borderColor="black" pb={1} mb={1}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a6a7d' }}>DISPONIBLE</Typography>
                </Box>
                <Typography variant="h4" color="black" fontWeight="bold">
                  S/. {stockProducto.precio?.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#4a6a7d',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2c4750', 
                    },
                  }}
                  onClick={handleAddToCart}
                  disabled={admin !== null} 
                >
                  AÑADIR AL CARRITO
                </Button>
                <Box mt={2} />
                <CantidadProducto cantidad={cantidad} aumentar={aumentarCantidad} disminuir={disminuirCantidad} />
                <Typography variant="body2" mt={2}>
                  <Link href="#" color="inherit">
                    Ver métodos de envío disponibles
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Descripción</Typography>
          <Typography variant="body1" paragraph color="textSecondary">
            {stockProducto.descripcion}
          </Typography>
        </Box>

        <Box mt={4} mb={4} bgcolor="#ebf3ff" p={2} borderRadius={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Características del Producto:</Typography>
          {stockProducto?.caracteristicas?.length > 0 ? (
            <ul>
              {stockProducto.caracteristicas.map((caracteristica, index) => (
                <li key={index}>
                  <Typography variant="body1">{caracteristica}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">No hay características disponibles.</Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DetalleProducto;


/*import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Button, Link } from '@mui/material';
import Header1 from '../../COMPONENTES/Header_Principal';
import CantidadProducto from '../BUSCAR_MEDICINAS/DETALLES/Cantidad.js';
import { useNavigate, useParams } from 'react-router-dom';
import Header_Botica from '../../COMPONENTES/Header_Botica.js';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockProducto, setStockProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    async function fetchStockProducto() {
      try {
        const response = await fetch(`http://localhost:4000/api/productos/stockProductos/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del stockProducto');
        }
        const producto = await response.json();
        setStockProducto(producto);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchStockProducto();
  }, [id]);

  const handleAddToCart = async () => {
    if (stockProducto) {
        try {
            // Obtener el ID del usuario desde el LocalStorage
            const usuario = JSON.parse(localStorage.getItem('user'));
            const usuarioID = usuario?.id;
            if (!usuarioID) {
                alert('No se encontró información del usuario. Por favor, inicia sesión.');
                return; // Si no hay un usuarioID, detiene la ejecución
            }
            // Intentar crear un carrito si no existe
            const responseCarrito = await fetch(`http://localhost:4000/api/carrito/crearCarritoSiNoExiste/${usuarioID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dataCarrito = await responseCarrito.json();
            if (!responseCarrito.ok) {
                alert('Error al verificar o crear el carrito.');
                return; // Detener si no se pudo crear o verificar el carrito
            }
            const carritoID = dataCarrito.carrito.id; // Obtener el ID del carrito desde la respuesta
            // Verificar los datos antes de enviarlos al backend
            console.log('Enviando datos al carrito:', {
                productoDetalleID: stockProducto.Producto.id,
                usuarioID: usuarioID,
                carritoID: carritoID,
                cantidad: cantidad,
            });
            // Llamamos al endpoint para agregar el producto al carrito
            const response = await fetch('http://localhost:4000/api/carrito/agregarProductoCarrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productoDetalleID: stockProducto.Producto.id,
                    carritoID: carritoID,
                    cantidad: cantidad,
                }),
            });
            if (response.ok) {
                // alert('Producto agregado al carrito correctamente');
                const event = new Event('cartUpdated');
                window.dispatchEvent(event);
            } else {
                const errorData = await response.json();
                alert('Error al agregar el producto al carrito: ' + errorData.mensaje);
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            alert('Error al agregar el producto al carrito. Intente nuevamente.');
        }
    }
  };

  const aumentarCantidad = () => {
    if (cantidad < stockProducto.cantidad) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (!stockProducto) {
    return <div>No se encontró el Producto que está buscando.</div>;
  }

  // Si el estado del producto es false, mostramos el mensaje de "Producto desactivado"
  if (stockProducto.estado === false) {
    return (
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4">Producto desactivado</Typography>
          <Typography variant="body1" color="textSecondary">
            Este producto no está disponible actualmente.
          </Typography>
        </Box>
      </Container>
    );
  }

  const imagenUrl = `http://localhost:4000/api/productoDetalle/${stockProducto.imageUrl}`;
  
  const admin = JSON.parse(localStorage.getItem('admin'));

  return (
    <>
      {admin ? <Header_Botica /> : <Header1 />}
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4">{stockProducto.Producto.nombre}</Typography>
          <Typography variant="body1" color="textSecondary">
            Marca: {stockProducto.Producto.Marca.nombre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Vendido por: {stockProducto.Botica.nombre}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              width="100%"
              height={300}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
              }}
            >
              <img
                src={imagenUrl}
                alt={stockProducto.Producto.nombre}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box border={1} borderColor="black" borderRadius={8} p={2} textAlign="center">
                <Box borderBottom={1} borderColor="black" pb={1} mb={1}>
                  <Typography variant="h6">DISPONIBLE</Typography>
                </Box>
                <Typography variant="h4" color="black" fontWeight="bold">
                  S/. {stockProducto.precio?.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  style={{ marginTop: 8, backgroundColor: '#4a6a7d', color: '#ffffff' }}
                  onClick={handleAddToCart}
                  disabled={admin !== null} // Deshabilitar si admin no es null
                >
                  AÑADIR AL CARRITO
                </Button>
                <Box mt={2} />
                <CantidadProducto cantidad={cantidad} aumentar={aumentarCantidad} disminuir={disminuirCantidad} />
                <Typography variant="body2" mt={2}>
                  <Link href="#" color="inherit">
                    Ver métodos de envío disponibles
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6">Descripción</Typography>
          <Typography variant="body1" paragraph>
            {stockProducto.descripcion}
          </Typography>
        </Box>

        <Box mt={4} mb={4} bgcolor="grey.300" p={2} borderRadius={3}>
          <Typography variant="h6">Características del Producto:</Typography>
          {stockProducto?.caracteristicas?.length > 0 ? (
            <ul>
              {stockProducto.caracteristicas.map((caracteristica, index) => (
                <li key={index}>
                  <Typography variant="body1">{caracteristica}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">No hay características disponibles.</Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DetalleProducto;*/
