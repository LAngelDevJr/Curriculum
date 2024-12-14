import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header1 from "../../COMPONENTES/Header_Principal";

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;
    if (usuarioID) {
      fetch(`http://localhost:4000/api/ordenes/ordenesUsuario/${usuarioID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener las órdenes del usuario');
          }
          return response.json();
        })
        .then(data => {
          console.log('Órdenes del usuario:', data);
          setOrdenes(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      alert('No se encontró información del usuario. Por favor, inicia sesión.');
    }
  }, []);

  return (
    <>
      <Header1 />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2F4156' }}>
            Mis Órdenes
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#567C8D' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID de la Orden</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Dirección de Envío</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Subtotal</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Costo de Envío</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Impuestos</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.map((orden) => (
                <React.Fragment key={orden.id}>
                  <TableRow>
                    <TableCell>{orden.id}</TableCell>
                    <TableCell>{orden.direccionEnvio}</TableCell>
                    <TableCell>{orden.estado}</TableCell>
                    <TableCell>S/ {orden.subtotal.toFixed(2)}</TableCell>
                    <TableCell>S/ {orden.costoEnvio.toFixed(2)}</TableCell>
                    <TableCell>S/ {orden.impuestos.toFixed(2)}</TableCell>
                    <TableCell><strong>S/ {orden.total.toFixed(2)}</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography sx={{ fontWeight: 'bold' }}>Productos en la Orden</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Nombre del Producto</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                                <TableCell>Precio Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orden.productos.map((producto, index) => (
                                <TableRow key={index}>
                                  <TableCell>{producto.nombre}</TableCell>
                                  <TableCell>{producto.cantidad}</TableCell>
                                  <TableCell>S/ {producto.precioUnitario.toFixed(2)}</TableCell>
                                  <TableCell>S/ {producto.precioTotal}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default MisOrdenes;
