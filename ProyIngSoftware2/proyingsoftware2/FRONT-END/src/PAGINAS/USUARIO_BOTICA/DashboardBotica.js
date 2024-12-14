import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import Header_Botica from '../../COMPONENTES/Header_Botica';
import BarraHorizontalBotica from '../../COMPONENTES/BarraHorizontalBotica';
import ContenidoDashboardBotica from './ContenidoDashboardBotica';

const DashboardBotica = () => {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha actual
  const [datosIngresos, setDatosIngresos] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      const user = JSON.parse(localStorage.getItem('admin'));
      const boticaID = user?.id;
  
      if (boticaID && fecha) {
        setDatosIngresos(null); 
        try {
          const respuesta = await fetch(`http://localhost:4000/api/botica/ingresosBotica/${boticaID}/${fecha}`);
          if (respuesta.ok) {
            const datos = await respuesta.json();
            setDatosIngresos(datos);
          } else {
            console.error("No se encontraron datos para la fecha seleccionada.");
          }
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      } else {
        console.error("No se encontró el ID de la botica o la fecha.");
      }
    };
  
    fetchIngresos();
  }, [fecha]); 

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header_Botica />
      <Box sx={{ mb: 2 }}>
        <BarraHorizontalBotica />
      </Box>
      <Box sx={{ flexGrow: 1, mx: 4, overflow: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D6E9FE',
            padding: '10px 20px',
            borderRadius: '8px',
            mb: 4,
            height: '50px',
            position: 'relative'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Box sx={{ position: 'absolute', right: '20px' }}>
            <TextField
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              sx={{ maxWidth: '150px' }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
        <ContenidoDashboardBotica datosIngresos={datosIngresos} />
      </Box>
    </Box>
  );
};

export default DashboardBotica;
