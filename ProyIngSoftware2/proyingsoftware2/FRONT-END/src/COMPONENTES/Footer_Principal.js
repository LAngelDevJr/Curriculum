import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Conteiner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #bcd1f1, #C8D9E6)', 
  padding: theme.spacing(4),
  display: 'flex',
  height: '150px',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

const Columnas = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(2),
  color: '#ffffff',
}));

const Titulo_Columnas = styled(Typography)(({ theme }) => ({
  fontFamily: 'Arial, sans-serif',
  color: '#333333', // Color del título
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const Texto_Columnas = styled(Typography)(({ theme }) => ({
  fontFamily: 'Arial, sans-serif',
  color: '#666666', // Color del texto
}));

const Subrayado = styled(Link)(({ theme }) => ({
  fontFamily: 'Arial, sans-serif',
  color: '#555555',
  cursor: 'pointer',
  textDecoration: 'none',
  margin: theme.spacing(0.5, 0),
  '&:hover': {
    color: '#000000', // Color en hover
    textDecoration: 'underline',
  },
}));

const FooterIconButton = styled(IconButton)(({ theme }) => ({
  color: '#555555',
  '&:hover': {
    color: '#1976d2', // Color en hover para los íconos
  },
}));

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path, section) => {
    navigate(path);
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <Conteiner>
      <Columnas>
        <Titulo_Columnas variant="h6" gutterBottom>
          DosisXtra
        </Titulo_Columnas>
        <Texto_Columnas variant="body2" gutterBottom>
          © 2010 – 2020
        </Texto_Columnas>
        <Subrayado href="#">Privacy - Terms</Subrayado>
      </Columnas>
      <Columnas>
        <Titulo_Columnas variant="h6" gutterBottom>
          Cuenta
        </Titulo_Columnas>
        <Subrayado href="/iniciarsesion">Login</Subrayado>
        <Subrayado href="/registrar">Registro</Subrayado>
        <Subrayado href="/carritocompra">Carrito</Subrayado>
      </Columnas>
      <Columnas>
        <Titulo_Columnas variant="h6" gutterBottom>
          Productos
        </Titulo_Columnas>
        <Subrayado onClick={() => handleNavigate('/MasVendido', 'vendidos')}>Más Vendidos</Subrayado>
        <Subrayado onClick={() => handleNavigate('/', 'nuevos')}>Nuevos</Subrayado>
        <Subrayado onClick={() => handleNavigate('/', 'ofertas')}>Ofertas</Subrayado>
      </Columnas>
      <Columnas>
        <Titulo_Columnas variant="h6" gutterBottom>
          Ayuda
        </Titulo_Columnas>
        <Subrayado href="/acercadenosotros">Acerca de Nosotros</Subrayado>
        <Subrayado href="/politicaenvio">Política de Envío</Subrayado>
        <Subrayado href="/faq">FAQ</Subrayado>
      </Columnas>
      <Columnas>
      <Box display="flex" justifyContent="center" marginTop="20px">
        <FooterIconButton href="https://www.facebook.com">
          <FacebookIcon sx={{ fontSize: 35 }} /> 
        </FooterIconButton>
        <FooterIconButton href="https://www.instagram.com">
          <InstagramIcon sx={{ fontSize: 35 }} />
        </FooterIconButton>
        <FooterIconButton href="https://twitter.com/home">
          <TwitterIcon sx={{ fontSize: 35 }} />
        </FooterIconButton>
        <FooterIconButton href="https://www.youtube.com">
          <YouTubeIcon sx={{ fontSize: 35 }} />
        </FooterIconButton>
      </Box>
      </Columnas>
    </Conteiner>
  );
};

export default Footer;
