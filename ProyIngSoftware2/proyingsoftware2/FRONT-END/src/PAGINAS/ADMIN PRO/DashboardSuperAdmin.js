import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import BarraHorizontalSuperAdmin from '../../COMPONENTES/BarraSuperAdmin'; // Importa tu barra personalizada
import Header_Admin from '../../COMPONENTES/Header_Admin';
import { useNavigate } from "react-router-dom";


const DashboardSuperAdmin = () => {

  const navigate = useNavigate();

  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    boticas: 0,
    administradores: 0,
  });

  const [adminInfo, setAdminInfo] = useState({
    nombre: '',
    apellido: '',
    dni: '',
  });

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const respuesta = await fetch('http://localhost:4000/api/adminMaestro/estadisticasSuperAdmin');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setEstadisticas(datos); // Actualiza el estado con los datos recibidos
        } else {
          console.error('No se pudieron obtener las estadísticas.');
        }
      } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
      }
    };

    const fetchAdminInfo = () => {
      try {
        const adminData = localStorage.getItem('adminMaestro'); // Obtén el elemento del localStorage
  
        if (adminData) {
          const datos = JSON.parse(adminData); // Convierte el string a un objeto JSON
          setAdminInfo({
            nombre: datos.nombre || '',  // Asegúrate de que las propiedades existen
            apellido: datos.apellidoPaterno || '',
            dni: datos.dni || '',
          });
        } else {
          console.error('No se encontraron datos en el localStorage para adminMaestro.');
          navigate("/InicioSesionBotica");
        }
      } catch (error) {
        console.error('Error al leer los datos del localStorage:', error);
      }
    };

    fetchAdminInfo();
    fetchEstadisticas();
  }, []); // Solo se ejecuta una vez al cargar el componente

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}> 
      {/* Header fijo */}
      <Header_Admin />  
      
      {/* Barra Horizontal */}
      <BarraHorizontalSuperAdmin />

      {/* Contenido del Dashboard */}
      <Box sx={{ flex: 1, mt: 4, mx: 4, overflow: 'auto' }}>
        {/* Mensaje de bienvenida */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E8F3FF',
            padding: '20px',
            borderRadius: '12px',
            mb: 4,
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#4A90E2',
              mb: 2,
            }}
          >
            ¡Bienvenido, SuperAdmin!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.2rem',
              color: '#555',
            }}
          >
            Desde este panel, puedes gestionar y desactivar usuarios, administradores y sus boticas de manera eficiente.  
          </Typography>
        </Box>

        {/* Información del Administrador */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F0F7FF',
            padding: '20px',
            borderRadius: '12px',
            mb: 4,
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#4A90E2',
              mb: 1,
            }}
          >
            Información del Administrador
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
            }}
          >
            <strong>Nombre:</strong> {adminInfo.nombre} {adminInfo.apellido}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
            }}
          >
            <strong>DNI:</strong> {adminInfo.dni}
          </Typography>
        </Box>

        {/* Estadísticas informativas */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                backgroundColor: '#F0F7FF',
                padding: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
                {estadisticas.administradores} {/* Muestra la cantidad de administradores */}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Administradores activos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                backgroundColor: '#F0F7FF',
                padding: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
                {estadisticas.usuarios} {/* Muestra la cantidad de usuarios */}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Usuarios registrados
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                backgroundColor: '#F0F7FF',
                padding: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
                {estadisticas.boticas} {/* Muestra la cantidad de boticas */}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Boticas activas
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSuperAdmin;
