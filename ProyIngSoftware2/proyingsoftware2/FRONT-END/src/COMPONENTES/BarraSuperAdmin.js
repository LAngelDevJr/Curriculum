import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Estilos personalizados para los botones de navegación
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

const BarraHorizontalSuperAdmin = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: '#4A90E2', borderRadius: '50px', maxWidth: '400px', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* Botón para Dashboard Super Admin */}
            <BotonNavegacion onClick={() => navigate('/DashboardSuperAdmin')}>
              Página Principal
            </BotonNavegacion>
            {/* Botón para Lista Admin */}
            <BotonNavegacion onClick={() => navigate('/ListaAdmin')}>
              Lista Admin
            </BotonNavegacion>
            
            {/* Botón para Lista Usuario */}
            <BotonNavegacion onClick={() => navigate('/ListaUsuariosAdmin')}>
              Lista Usuario
            </BotonNavegacion>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default BarraHorizontalSuperAdmin;
