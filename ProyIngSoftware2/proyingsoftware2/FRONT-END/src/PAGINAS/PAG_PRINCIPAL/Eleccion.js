import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HeaderPrincipal from '../../COMPONENTES/Header_Principal';
import { useNavigate } from 'react-router-dom';
import Footer from '../../COMPONENTES/Footer_Principal';
import NavegacionMedicinas from '../../COMPONENTES/NavegacionMedicinas';
import Header_Botica from '../../COMPONENTES/Header_Botica';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './EleccionCSS.css'
import ProductosDestacados from '../../COMPONENTES/ProductosDestacados';

const Eleccion = () => {

  const navigate = useNavigate();

  const handleCategoryClick = (categoria) => {
    navigate(`/productos/categoria/${categoria}`); 
  };

  const handleRedirect = () => {
      navigate('/BusquedaMedicina');
    };

    const responsiveWall = {
      General: {
        breakpoint: { max: 4000, min: 1024 },
        items: 1,
        slidesToSlide: 1 
      }
    };
    const admin = JSON.parse(localStorage.getItem('admin'));


  return (
    <>
      {admin ? <Header_Botica /> : <HeaderPrincipal />}
      <NavegacionMedicinas />
      <Carousel responsive={responsiveWall} infinite={true} autoPlay={true} autoPlaySpeed={3000} showDots={true} draggable={false}>
        <div className="Wall">
          <img src={'https://images-1.eucerin.com/~/media/eucerin%20relaunch%20media/eucerin/local/latam/2024/especiales/proteccion-solar-que-va-contigo/cambios-cl/banner_sun_face_range_hero-desktop.gif'}/>
        </div>
        <div className="Wall">
          <img src={'https://www.farmaciasdirect.es/cdn/shop/files/x430dzE1KwJLUus6TvUb0I2sNfJbneqqCFKCRe2P_9d7c5838-283a-4cb6-9ddf-2f7a5a43baec.jpg?v=1725884791&width=1500'}/>
        </div>
        <div className="Wall">
          <img src={'https://www.cerave.pe/-/media/project/loreal/brand-sites/cerave/shared/ciulad/mx-ciulad-landing-banner-lg.jpg?rev=-1'}/>
        </div>
        <div className="Wall">
          <img src={'https://storage.googleapis.com/twg-content/images/cabeceragoogle2.width-1200.jpg'}/>
        </div>
        <div className="Wall">
          <img src={'https://www.marvimundo.com/media/wysiwyg/Banner_Nivea_1.1.jpg'}/>
        </div>
      </Carousel>


      <Box 
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '20px',  
        marginBottom: '40px',
        cursor: 'pointer', // Cambia el cursor para indicar que es clickeable
      }}
      onClick={handleRedirect}
    >
      <img 
        src="https://images.ctfassets.net/buvy887680uc/2jZoIRO7CJUdFxZsr85e9i/3aa000d0df6d3634d59b99aee5dd0002/Fotoproteccion-dermocosmetica-mifarma-Bx1-web.jpg" 
        alt="Fotoprotección Dermocosmética" 
        style={{
          maxWidth: '100%', 
          height: 'auto', 
          borderRadius: '8px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      />
    </Box>

    <ProductosDestacados />
    <br/>
    <br/>
    <Box sx={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh', 
      width: '100%', 
      backgroundColor: '#FDFAF8', 
      textAlign: 'center',
      marginBottom: '50px',
      marginTop: '20px', 
    }}>

        <Box sx={{ zIndex: 2, background: 'linear-gradient(to bottom, #ebf3ff, white)', width: '100%', padding: '20px' }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontSize: '28px', fontWeight: 'bold', color: '#223D53' }}>
            ¿En qué le podemos ayudar?
          </Typography>
          
          <Grid container spacing={4} justifyContent="center" sx={{ width: '100%',  alignContent: 'center', margin: 'auto' }}>
            
            <Grid item xs={12} sm={4} md={3}>
              <Button className='medicinasbton' onClick={() => navigate('/BusquedaMedicina')} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocalPharmacyIcon sx={{ fontSize: 70, color: '#ffffff' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
                    Buscar Medicinas
                  </Typography>
                </Box>
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <Button className='boticasbton' onClick={()=> navigate('/BoticasCercanas')} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <StorefrontIcon sx={{ fontSize: 70, color: '#ffffff' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
                    Boticas Cercanas
                  </Typography>
                </Box>
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <Button className='consultasbton' disabled sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <HealthAndSafetyIcon sx={{ fontSize: 70, color: '#ffffff' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
                    Asistencia Médica
                  </Typography>
                </Box>
              </Button>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold', color: '#555' }}>
                Próximamente
              </Typography>
            </Grid>
            
          </Grid>
        </Box>
      </Box>


      <div className="productos-categoria">
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontSize: '28px', fontWeight: 'bold', color: '#223D53' }}>
        Categorías
        </Typography>
        <div className="imagenes">
          <div className="imagen-container">
            <Button className='button' onClick={() => handleCategoryClick('Medicamentos')}>
              <div className="imagen-overlay">
                <img src="https://www.farmaceuticonline.com/wp-content/uploads/2019/07/medicament-que-es.jpg" alt="Medicamentos" />
                <span className="imagen-text">Medicamentos</span>
              </div>
            </Button>
          </div>
          <div className="imagen-container">
            <Button className='button' onClick={() => handleCategoryClick('Adulto Mayor')}>
              <div className="imagen-overlay">
                <img src="https://www2.ucsm.edu.pe/wp-content/uploads/2023/08/dia-del-adulto-mayor-1.png" alt="Adulto Mayor" />
                <span className="imagen-text">Adulto Mayor</span>
              </div>
            </Button>
          </div>
          <div className="imagen-container">
            <Button className='button' onClick={() => handleCategoryClick('Infantil')}>
              <div className="imagen-overlay">
                <img src="https://www.arie.org.pe/wp-content/uploads/2020/08/shutterstock_705239125-1200x810.jpg" alt="Infantil" />
                <span className="imagen-text">Infantil</span>
              </div>
            </Button>
          </div>
          <div className="imagen-container">
            <Button className='button' onClick={() => handleCategoryClick('Vitaminas y Suplementos')}>
              <div className="imagen-overlay">
                <img src="https://sintergia-nutricion.com/wp-content/uploads/2019/07/nutricion-ortomolecular-1.jpg" alt="Vitaminas y Suplementos" />
                <span className="imagen-text">Vitaminas y Suplementos</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

     

      <Footer/>
    </>
  );
};

export default Eleccion;