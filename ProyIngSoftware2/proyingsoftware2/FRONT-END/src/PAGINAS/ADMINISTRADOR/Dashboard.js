import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import HeaderAdmin from '../../COMPONENTES/Header_Admin'; // Asegúrate de importar el Header correcto
import BarraHorizontal from '../../COMPONENTES/BarraHorizontalAdmin'; // Barra de navegación creada previamente
import ContenidoDashboard from '../ADMINISTRADOR/ContenidoDashboard';

const Dashboard = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header fijo */}
      <HeaderAdmin />
      <Box sx={{ mb: 2 }}> {/* Aumenté el margen inferior a 4 */}
        <BarraHorizontal />
      </Box>
      

      {/* Cuerpo del dashboard ajustado al tamaño de la ventana */}
      <Box sx={{ flexGrow: 1, mx: 4, overflow: 'auto' }}>
        
      <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',  // Centra el contenido principal
    backgroundColor: '#D6E9FE',
    padding: '10px 20px',
    borderRadius: '8px',
    mb: 4,
    height: '50px',
    position: 'relative'  // Permite posicionar el input de fecha de manera absoluta
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
    Dashboard
  </Typography>

  <Box
    sx={{
      position: 'absolute',
      right: '20px'  // Alinea el input de fecha a la derecha
    }}
  >
    <TextField
      type="date"
      sx={{
        maxWidth: '150px',
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </Box>
</Box>



        {/* Cuerpo del dashboard */}
        <ContenidoDashboard />
      </Box>
    </Box>
  );
};

export default Dashboard;
