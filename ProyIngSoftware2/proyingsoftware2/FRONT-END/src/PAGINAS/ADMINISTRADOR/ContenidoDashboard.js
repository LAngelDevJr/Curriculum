import { Typography, Grid, Paper } from '@mui/material';

const ContenidoDashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ backgroundColor: '#D6E9FE', padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>69</Typography>
          <Typography variant="body1">Órdenes del día de hoy</Typography>
        </Paper>
      </Grid>

      
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ backgroundColor: '#D6E9FE', padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>69</Typography>
          <Typography variant="body1">Ingresos de hoy</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContenidoDashboard;
