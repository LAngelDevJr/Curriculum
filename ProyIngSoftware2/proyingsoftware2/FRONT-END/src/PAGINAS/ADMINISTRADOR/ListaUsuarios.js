import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import HeaderAdmin from '../../COMPONENTES/Header_Admin';
import BarraHorizontalAdmin from '../../COMPONENTES/BarraHorizontalAdmin';
import ContenidoListaUsuariosAdmin from './ContenidoTablas/ContenidoListaUsuariosAdmin';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda

  // Función para obtener los usuarios del backend
  const Usuarios = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/usuarios'); // URL de tu backend
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data); // Actualizamos el estado con los datos obtenidos
      } else {
        console.error('Error al obtener los usuarios');
      }
    } catch (error) {
      console.error('Error en la solicitud', error);
    }
  };

  // Se usa useEffect para llamar a la función cuando el componente se monta
  useEffect(() => {
    Usuarios();
  }, []);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setBusqueda(e.target.value);
  };

  // Filtrar los usuarios según el valor de búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header fijo */}
      <HeaderAdmin />
      
      <BarraHorizontalAdmin />

      {/* Cuerpo ajustado */}
      <Box sx={{ flexGrow: 1, mx: 4, mt: 4, overflow: 'auto' }}>
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
          <Typography variant="h6">Usuarios Registrados</Typography>
        </Box>

        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          label="Buscar por nombre, apellido o correo"
          variant="outlined"
          value={busqueda}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        {/* Tabla con usuarios */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Fecha de Registro</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <ContenidoListaUsuariosAdmin key={usuario.id} usuario={usuario} /> 
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ListaUsuarios;
