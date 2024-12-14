import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const BotonNavegacion = styled(Button)(({ theme }) => ({
  color: '#fff',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginRight: theme.spacing(3),
  '&:hover': {
    backgroundColor: '#15489A',
  },
}));

const BarraHorizontalAdmin = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: '#4A90E2', borderRadius: '50px', maxWidth: '600px', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <BotonNavegacion onClick={() => navigate('/Dashboard')} >
              Dashboard
            </BotonNavegacion>
            <BotonNavegacion onClick={() => navigate('/ListaUsuarios')} >
              Usuarios registrados
            </BotonNavegacion>
            <BotonNavegacion onClick={() => navigate('/ListaProductos')} >
              Productos
            </BotonNavegacion>
            <BotonNavegacion  onClick={() => navigate('/OrdenesUsuario')}>
              Órdenes
            </BotonNavegacion>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default BarraHorizontalAdmin;
