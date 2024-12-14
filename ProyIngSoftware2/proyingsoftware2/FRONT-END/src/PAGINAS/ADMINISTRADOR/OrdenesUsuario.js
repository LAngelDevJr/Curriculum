import HeaderAdmin from '../../COMPONENTES/Header_Admin'; 
import BarraHorizontal from '../../COMPONENTES/BarraHorizontalAdmin';
import ContenidoOrdenesUsuarioAdmin from './ContenidoTablas/ContenidoOrdenesUsuarioAdmin';
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Pagination } from '@mui/material';

const Ordenes = () => {
    // Estado para controlar la búsqueda y las órdenes
    const [busqueda, setBusqueda] = useState('');
    const [ordenes, setOrdenes] = useState([
        { id: 1, usuario: 'Juan Sanchez', fecha: '11/03/2023', total: 'S/125.00', correo: 'altavista@123.com', estado: 'Entregado' },
        { id: 2, usuario: 'Carlos Perez', fecha: '12/03/2023', total: 'S/150.00', correo: 'carlos@correo.com', estado: 'Pendiente' },
        { id: 3, usuario: 'Maria Garcia', fecha: '13/03/2023', total: 'S/200.00', correo: 'maria@correo.com', estado: 'Entregado' },
        // Se pueden agregar más órdenes aquí...
    ]);

    const handleSearchChange = (e) => {
        setBusqueda(e.target.value);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
                <HeaderAdmin />
            </Box>

            <BarraHorizontal />

            <Box sx={{ flexGrow: 1, mx: 4, mt: 4, overflow: 'auto' }}>
                {/* Sección de Órdenes */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#D6E9FE',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    mb: 4,
                    height: '50px'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Órdenes
                  </Typography>
                </Box>

                {/* Barra de búsqueda */}
                <TextField
                  fullWidth
                  label="Buscar por nombre o apellido de usuario o nro de orden"
                  variant="outlined"
                  value={busqueda}
                  onChange={handleSearchChange}
                  sx={{ mb: 3 }}
                />

                {/* Tabla de Órdenes */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Usuario</strong></TableCell>
                                <TableCell><strong>Fecha de Orden</strong></TableCell>
                                <TableCell><strong>Total</strong></TableCell>
                                <TableCell><strong>Correo</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes.map((orden) => (
                                <ContenidoOrdenesUsuarioAdmin key={orden.id} orden={orden} 
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination count={11} page={2} color="primary" />
                </Box>
            </Box>
        </Box>
    );
};

export default Ordenes;
