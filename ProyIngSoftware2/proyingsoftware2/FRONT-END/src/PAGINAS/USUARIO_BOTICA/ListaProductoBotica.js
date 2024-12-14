import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import Header_Botica from '../../COMPONENTES/Header_Botica';
import BarraHorizontalBotica from '../../COMPONENTES/BarraHorizontalBotica';
import { useNavigate } from 'react-router-dom';
import ContenidoTablaProductoBotica from '../USUARIO_BOTICA/Contenido Tablas/ContenidoTablaProductoBotica.js';

const ListaProductosBotica = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  

  // Función para actualizar el estado de un producto en el estado local
  const actualizarEstadoProducto = (idProducto) => {
    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto 
          ? { ...producto, estado: producto.estado === 'Disponible' ? 'No Disponible' : 'Disponible' } 
          : producto
      )
    );
  };
  


  useEffect(() => {
    const fetchProductos = async () => {
      const admin = JSON.parse(localStorage.getItem('admin')); // Obtener el ID de la botica
      const boticaID = admin?.id;

      if (boticaID) {
        try {
          const respuesta = await fetch(`http://localhost:4000/api/admin/boticaProductos/${boticaID}`);
          const resultado = await respuesta.json();

          const productosBotica = resultado.map(producto => ({
            id: producto?.id || 'Sin ID',
            marca: producto?.Producto?.Marca?.nombre || 'Sin marca',
            nombre: producto?.Producto?.nombre || 'Sin nombre',
            precio: producto?.precio || 'Sin precio',
            fechaRegistro: producto?.fechaRegistro || 'Fecha no disponible',
            stock: producto?.cantidad || 'Sin stock',
            estado: producto?.estado === true ? 'Disponible' : 'No Disponible',
          }));

          setProductos(productosBotica);
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      } else {
        console.error("No se encontró el ID de la botica en el localStorage");
        navigate('/InicioSesionBotica');
      }
    };

    fetchProductos();
  }, [navigate]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header_Botica />
      <BarraHorizontalBotica />

      <Box sx={{ flexGrow: 1, mx: 4, mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#D6E9FE',
            padding: '10px 20px',
            borderRadius: '8px',
            mb: 4,
          }}
        >
          <Typography variant="h6">Productos</Typography>
          <Button onClick={() => navigate('/AgregarProducto')}> Agregar Producto </Button>
        </Box>

        <TableContainer component={Paper} sx={{ height: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Marca</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Precio</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Fecha Registro</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Stock</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Estado</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <ContenidoTablaProductoBotica 
                  key={producto.id} 
                  producto={producto} 
                  onEstadoChange={actualizarEstadoProducto}
                  
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ListaProductosBotica;
