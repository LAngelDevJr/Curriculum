import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

// Estilo para el título "DosisXtra"
const Titulo_Boton = styled(Button)(({ theme }) => ({
  color: '#000000',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  fontFamily: 'Arial, sans-serif',
  transition: 'color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    color: '#2F4156',
    transform: 'scale(1.1)',
  },
}));

const Header_Admin = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminMaestro'));
    if (user) {
      setLoggedIn(true);
      // Asegúrate de ajustar aquí las propiedades de tu modelo de usuario
      setUserName(`${user.nombre} ${user.apellidoPaterno}`);
    } else {
      setLoggedIn(false);
      setUserName('');
    }

    // Escuchar cambios en el localStorage
    const storageChangeHandler = () => {
      const updatedUser = JSON.parse(localStorage.getItem('adminMaestro'));
      if (updatedUser) {
        setLoggedIn(true);
        setUserName(`${updatedUser.nombre} ${updatedUser.apellidoPaterno}`);
      } else {
        setLoggedIn(false);
        setUserName('');
      }
    };

    window.addEventListener('storage', storageChangeHandler);

    return () => {
      window.removeEventListener('storage', storageChangeHandler);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminMaestro');
    setLoggedIn(false);
    setUserName('');
    navigate('/InicioSesionBotica'); // Ajusta la ruta para cerrar sesión si es necesario
  };

  const handleProfileClick = () => {
    navigate('/DashboardSuperAdmin'); // Redirige al dashboard de botica
  };

  return (
    <Box>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <AppBar position="static" sx={{ backgroundColor: '#FFFFFF' }} elevation={4}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Titulo_Boton onClick={() => navigate('/DashboardSuperAdmin')}>
                DosisXtra
              </Titulo_Boton>
            </Box>

            <Grow in={true} timeout={1000}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Modo Botica
              </Typography>
            </Grow>

            {loggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ color: '#000000', marginRight: 2 }}>
                  {userName}
                </Typography>
                <IconButton
                  onClick={handleProfileClick} // Redirige al dashboard cuando se haga clic
                  sx={{ color: '#000000' }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#567C8D', color: '#ffffff', marginLeft: 2 }}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#567C8D', color: '#ffffff' }}
                onClick={() => navigate('/InicioSesion')}
              >
                Iniciar Sesión
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
    </Box>
  );
};

export default Header_Admin;
