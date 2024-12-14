import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const NavegacionMedicinas = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoria) => {
    navigate(`/productos/categoria/${categoria}`); 
  };
  
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ebf3ff', height: '30px' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <Button sx={{ color: '#223D53', mx: 2 }} onClick={() => handleCategoryClick('Medicamentos')}>
            <Typography variant="button"><b>Medicamentos</b></Typography>
          </Button>
          <Button sx={{ color: '#223D53', mx: 2 }} onClick={() => handleCategoryClick('Adulto Mayor')}>
            <Typography variant="button"><b>Adulto Mayor</b></Typography>
          </Button>
          <Button sx={{ color: '#223D53', mx: 2 }} onClick={() => handleCategoryClick('Infantil')}>
            <Typography variant="button"><b>Infantil</b></Typography>
          </Button>
          <Button sx={{ color: '#223D53', mx: 2 }} onClick={() => handleCategoryClick('Vitaminas y Suplementos')}>
            <Typography variant="button"><b>Vitaminas y Suplementos</b></Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavegacionMedicinas;






