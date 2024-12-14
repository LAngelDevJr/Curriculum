import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import Header1 from '../../COMPONENTES/Header_Principal'; // Cambia según tu componente de header

const MasVendido = () => {
  const [productos, setProductos] = useState([]);
  const [verMas, setVerMas] = useState(false);

  useEffect(() => {
    async function fetchMasVendidos() {
      try {
        const response = await fetch('http://localhost:4000/api/productos/masVendidos');
        if (!response.ok) {
          throw new Error('Error al obtener los productos más vendidos');
        }
        const data = await response.json();

        const baseUrl = `http://localhost:4000/api/productoDetalle/`;

        const adaptados = data.map((producto, index) => ({
          ranking: index + 1,
          id: producto.productoDetalleID,
          name: producto.nombre,
          image: `${baseUrl}${producto.imageUrl}`,
          precio: producto.precio,
          totalVendido: producto.totalVendido,
          botica: producto.botica,
        }));
        setProductos(adaptados);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchMasVendidos();
  }, []);

  return (
    <Box>
      {/* Header fijo */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Header1 />
      </Box>

      {/* Espaciador para evitar superposición */}
      <Box sx={{ height: '64px' }}></Box>

      {/* Contenido de la página */}
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#333' }}
          >
            Ranking de Productos Más Vendidos
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            sx={{ mb: 4 }}
          >
            Los productos más populares entre nuestros clientes, ordenados por ventas.
          </Typography>
          <Grid container spacing={3}>
            {productos.map((producto) => (
              <Grid item xs={12} key={producto.id}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    boxShadow: 3,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#4a6a7d',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      marginRight: 3,
                    }}
                  >
                    {producto.ranking}
                  </Typography>
                  <CardMedia
                    component="img"
                    image={producto.image}
                    alt={producto.name}
                    sx={{ width: 100, height: 100, borderRadius: 2, marginRight: 3 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {producto.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Vendido por: {producto.botica}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Cantidad vendida: {producto.totalVendido}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: '#4a6a7d', fontWeight: 'bold', mt: 1 }}
                    >
                      S/. {producto.precio.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        window.location.href = `/detalles/${producto.id}`; // Redirigir a la página de detalles
                      }}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        backgroundColor: '#fff',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      Ver Más
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MasVendido;
