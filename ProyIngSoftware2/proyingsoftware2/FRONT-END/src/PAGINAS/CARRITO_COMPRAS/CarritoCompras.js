import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Grid, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Header_Principal from '../../COMPONENTES/Header_Principal';

const CarritoCompras = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;

    if (usuarioID) {
      fetch(`http://localhost:4000/api/carrito/productos/${usuarioID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los productos del carrito');
          }
          return response.json();
        })
        .then(data => {
          console.log('Productos en el carrito:', data);
          setProductos(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      alert('No se encontró información del usuario. Por favor, inicia sesión.');
    }
  }, []);
  
  const handleEliminarProducto = async (productoID) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;

    if (!usuarioID) {
      alert('No se encontró información del usuario. Por favor, inicia sesión.');
      return;
    }

    try {
      console.log(`Eliminando producto con ID ${productoID} para el usuario ${usuarioID}`);
      const response = await fetch(`http://localhost:4000/api/carrito/eliminarProducto/${usuarioID}/${productoID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualizar el estado localmente sin necesidad de recargar la página
        setProductos(prevProductos => 
          prevProductos.filter(producto => producto.productoID !== productoID)
        );

        // Disparar el evento para actualizar otros componentes si es necesario
        const event = new Event('cartUpdated');
        window.dispatchEvent(event);
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar el producto:', errorData.mensaje);
        alert('Error al eliminar el producto: ' + errorData.mensaje);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto. Intente nuevamente.');
    }
  };

  const handleCantidadChange = async (id, accion) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;

    if (!usuarioID) {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/carrito/actualizarCantidad/${usuarioID}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accion })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al actualizar la cantidad:', errorData.mensaje);
            alert('Error al actualizar la cantidad: ' + errorData.mensaje);
            return;
        }

        const data = await response.json();

        setProductos(prevProductos => 
            prevProductos.map(producto =>
                producto.productoID === id ? { ...producto, cantidad: data.nuevaCantidad } : producto
            )
        );

        const event = new Event('cartUpdated');
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        alert('Error al actualizar la cantidad. Intente nuevamente.');
    }
  };

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => {
      const precio = producto.precio || 0;
      const cantidad = producto.cantidad || 0;
      return total + (precio * cantidad);
    }, 0).toFixed(2);
  };

  const verificarYProcederAlPago = () => {
    // Log detallado de cada producto y su botica y estado
    productos.forEach((producto, index) => {
        console.log(`Producto ${index + 1}:`, producto);
        console.log(`Botica del producto ${index + 1}:`, producto.botica);
        console.log(`Estado del producto ${index + 1}:`, producto.estado);
    });

    // Obtener todos los nombres de botica de los productos en el carrito
    const boticaNombres = productos.map((producto) => producto.botica);
    console.log("Nombres de Boticas en el carrito:", boticaNombres);

    // Verificar que cada producto tenga un nombre de botica asignado
    const allHaveBoticaName = boticaNombres.every((nombre) => nombre !== undefined && nombre !== null);

    // Comprobar si todos los productos pertenecen a la misma botica comparando nombres
    const allSameBotica = boticaNombres.every((nombre) => nombre === boticaNombres[0]);

    // Verificación de estado activo para todos los productos
    const productoInactivo = productos.find((producto) => producto.estado === false);
    
    if (productoInactivo) {
        // Si algún producto está desactivado, mostrar alerta y detener el flujo
        alert(`El producto "${productoInactivo.nombre}" está desactivado`);
    } else if (allHaveBoticaName && allSameBotica) {
        // Si todos los productos tienen nombre de botica, pertenecen a la misma y están activos, proceder al pago
        console.log("Todos los productos pertenecen a la misma botica y están activos. Navegando a la página de pago.");
        navigate('/PaginaPago');
    } else {
        console.log("Los productos no pertenecen a la misma botica o faltan nombres de botica.");
        alert("Todos los productos en el carrito deben pertenecer a la misma botica para proceder al pago.");
    }
};

  
  

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header_Principal />

      <Box sx={{ flexGrow: 1, mx: 4, mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#D6E9FE',
            padding: '10px 20px',
            borderRadius: '8px',
            mb: 4,
          }}
        >
          <Typography variant="h6">Carrito de Compras</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>


            <Table>
  <TableHead>
    <TableRow>
      <TableCell>Imagen</TableCell>
      <TableCell>Nombre del Producto</TableCell>
      <TableCell>Precio</TableCell>
      <TableCell>Cantidad</TableCell>
      <TableCell>Subtotal</TableCell>
      <TableCell>Botica</TableCell> {/* Nueva columna para mostrar la botica */}
      <TableCell>Eliminar</TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {productos.map((producto) => (
      <TableRow key={producto.id}>
        <TableCell>
          <img
            src={producto.imagen || 'https://via.placeholder.com/100'}
            alt={producto.nombre || 'Nombre no disponible'}
            style={{ width: '100px', height: '100px' }}
          />
        </TableCell>
        <TableCell>{producto.nombre || 'Nombre no disponible'}</TableCell>
        <TableCell>S/ {(producto.precio || 0).toFixed(2)}</TableCell>

        <TableCell>
          <IconButton onClick={() => handleCantidadChange(producto.productoID, 'decrementar')}>
            <RemoveIcon />
          </IconButton>
          <TextField
            type="number"
            value={producto.cantidad || 1}
            inputProps={{ min: 1, style: { textAlign: 'center' }, step: 'any' }}
            sx={{ 
              width: '60px', 
              textAlign: 'center',
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                display: 'none',
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              }
            }}
            readOnly
          />
          <IconButton onClick={() => handleCantidadChange(producto.productoID, 'incrementar')}>
            <AddIcon />
          </IconButton>
        </TableCell>

        <TableCell>
          S/ {((producto.precio || 0) * (producto.cantidad || 1)).toFixed(2)}
        </TableCell>

        <TableCell>
          {producto.botica || 'No especificada'} {/* Mostrar el nombre de la botica */}
        </TableCell>

        <TableCell>
          <IconButton onClick={() => handleEliminarProducto(producto.productoID)}>
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h6">Resumen del Pedido</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal:</Typography>
                <Typography>S/ {calcularSubtotal()}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">S/ {calcularSubtotal()}</Typography>
              </Box>
              <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={verificarYProcederAlPago} // Llamada a la función de verificación
              >
                Proceder al Pago
                </Button>
              <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/')}>
                Seguir Comprando
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CarritoCompras;
