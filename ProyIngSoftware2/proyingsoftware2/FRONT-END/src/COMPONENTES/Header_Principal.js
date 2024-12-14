import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import BarraBusqueda from './Barra_Busqueda';
import logoDosisXtra from '../imagenes/Logo/Logo_DosisXtra.png';



const Barra = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

const Titulo_Boton = styled(Button)(({ theme }) => ({
  color: '#000000',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1.25rem',
  fontFamily: 'Arial, sans-serif',
  transition: 'color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    color: '#2F4156',
    transform: 'scale(1.1)',
  },
}));

const Navegar = styled(Button)(({ theme }) => ({
  color: '#000000',
  textTransform: 'none',
  marginLeft: theme.spacing(2),
  fontFamily: 'Arial, sans-serif',
  transition: 'color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    color: '#2F4156',
    transform: 'scale(1.1)',
  },
}));

const Header1 = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const usuarioID = user?.id;

    if (user) {
      setLoggedIn(true);
      setUserName(`${user.nombre} ${user.apellidoPaterno}`);
    } else {
      setLoggedIn(false);
      setUserName('');
    }

    const updateCartCount = async () => {
      if (!usuarioID) {
        console.error('Usuario no encontrado');
        setCartItemCount(0);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/carrito/cantidadProductos/${usuarioID}`);

        if (!response.ok) {
          throw new Error('Error al obtener la cantidad de productos');
        }

        const data = await response.json();
        setCartItemCount(data.totalProductos);
      } catch (error) {
        console.error('Error al actualizar el conteo del carrito:', error);
        setCartItemCount(0);
      }
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);

    const storageChangeHandler = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      if (updatedUser) {
        setLoggedIn(true);
        setUserName(`${updatedUser.nombre} ${updatedUser.apellidoPaterno}`);
      } else {
        setLoggedIn(false);
        setUserName('');
      }
      updateCartCount();
    };

    window.addEventListener('storage', storageChangeHandler);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', storageChangeHandler);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUserName('');
    navigate('/InicioSesion');
  };

  const handleNavigate = (path, section) => {
    navigate(path);
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    // Redirige al perfil del usuario
    navigate(`/perfil/${JSON.parse(localStorage.getItem('user')).id}`);
  };

  return (
    <Barra>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <AppBar position="static" sx={{ backgroundColor: '#5f9fbf', paddingTop:'6px',paddingBottom:'6px' }} elevation={4}>
          <Toolbar>
          <Grow in={true} timeout={500}>
            <Titulo_Boton onClick={() => handleNavigate('/')} sx={{ fontSize: '28px', color: 'white', display: 'flex', alignItems: 'center' }}>
              <img src={logoDosisXtra} alt="Logo DosisXtra" style={{ width: '52px', marginRight: '10px' }} />
              DosisXtra
            </Titulo_Boton>
          </Grow>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', mx: 2 }}>
              <BarraBusqueda />
            </Box>

            <IconButton onClick={() => handleNavigate('/CarritoCompras')} sx={{ color: 'white' }}>
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#FF0000',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}
                >
                  {cartItemCount}
                </Box>
              )}
            </IconButton>

            <Grow in={true} timeout={1300}>
              <Navegar onClick={() => handleNavigate('/ayuda')} sx={{color: 'white'}}>
                <strong>Ayuda</strong>
              </Navegar>
            </Grow>

            {loggedIn ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                  <Typography sx={{ color: 'white', marginRight: 1, cursor: 'pointer',  }} onClick={handleProfileClick}>
                    {userName}
                  </Typography>
                  <IconButton onClick={handleProfileClick} sx={{ color: 'white', height: '50px' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ marginLeft: 2, color: '#567C8D', borderColor: '#28639b' , color: 'white'}}
                  onClick={() => handleNavigate('/MisOrdenes')}
                >
                  Ver mis ordenes
                </Button>
                <Button
                  variant="contained"
                  sx={{ marginLeft: 2, backgroundColor: '#0b559c', color: '#ffffff' }}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Grow in={true} timeout={1500}>
                <Button
                  variant="contained"
                  sx={{ marginLeft: 2, backgroundColor: '#567C8D', color: '#ffffff' }}
                  onClick={() => navigate('/InicioSesion')}
                >
                  Iniciar Sesión
                </Button>
              </Grow>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
    </Barra>
  );
};

export default Header1;
