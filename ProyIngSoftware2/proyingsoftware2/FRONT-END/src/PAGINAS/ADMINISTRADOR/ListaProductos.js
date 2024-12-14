import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import HeaderAdmin from '../../COMPONENTES/Header_Admin';
import BarraHorizontalAdmin from '../../COMPONENTES/BarraHorizontalAdmin';
import { useNavigate } from 'react-router-dom';
import ContenidoTablaProductoAdmin from './ContenidoTablas/ContenidoListaProductoAdmin';
const ListaProductos = () => {
  const navigate = useNavigate();

  // Datos simulados, puedes sustituirlos con datos de tu base de datos
  const productos = [
    { id: 1, nombre: 'Producto A', precio: 'S/ 50.00', fechaRegistro: '10/09/2023', stock: 100, estado: 'Disponible' },
    { id: 2, nombre: 'Producto B', precio: 'S/ 30.00', fechaRegistro: '12/09/2023', stock: 50, estado: 'No disponible' },
    { id: 3, nombre: 'Producto C', precio: 'S/ 45.00', fechaRegistro: '15/09/2023', stock: 20, estado: 'Disponible' },
    { id: 4, nombre: 'Producto D', precio: 'S/ 25.00', fechaRegistro: '18/09/2023', stock: 0, estado: 'No disponible' },
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderAdmin />
      <BarraHorizontalAdmin />

      {/* Contenido principal con flexGrow para ocupar el resto del espacio disponible */}
      <Box sx={{ flexGrow: 1, mx: 4, mt: 4 }}>
        {/* Caja de "Productos" similar a la de "Usuarios Registrados" */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#D6E9FE', // Azul claro
            padding: '10px 20px',
            borderRadius: '8px',
            mb: 4,
          }}
        >
          <Typography variant="h6">Productos</Typography>
          <Button onClick={() => navigate('/AgregarProducto')}> Agregar Producto </Button>
        </Box>

        {/* Tabla de productos */}
        <TableContainer component={Paper} sx={{ height: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Fecha de Registro</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
               <ContenidoTablaProductoAdmin key={producto.id} producto={producto}/> 
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ListaProductos;
