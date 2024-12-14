import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

const ContenidoDashboardBotica = ({ datosIngresos }) => {
  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ backgroundColor: '#D6E9FE', padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {datosIngresos ? datosIngresos.cantidadOrdenes : 'N/A'}
          </Typography>
          <Typography variant="body1">Órdenes del día de hoy</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ backgroundColor: '#D6E9FE', padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {datosIngresos ? `S/. ${datosIngresos.ingresosTotales}` : 'N/A'}
          </Typography>
          <Typography variant="body1">Ingresos de hoy</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContenidoDashboardBotica;
