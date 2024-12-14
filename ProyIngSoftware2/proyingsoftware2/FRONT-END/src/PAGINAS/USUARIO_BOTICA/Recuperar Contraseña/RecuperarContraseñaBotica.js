import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../../COMPONENTES/Header_3';
import Footer from '../../../COMPONENTES/Footer_Principal';

const RecuperarContraseñaBotica = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      
      const response = await fetch(`http://localhost:4000/api/admin/verificarCorreoAdmin/${encodeURIComponent(email)}`);
  
      const data = await response.json();
  
      if (response.ok) {
        // Si el correo existe, redirigir a la vista de restablecimiento de contraseña
        navigate('/RestablecerContraseñaBotica', { state: { email } });
      } else {
        setError(data.message || 'No se ha encontrado una Botica registrada con ese correo');
      }
    } catch (error) {
      console.error('Error al intentar verificar el correo:', error);
      setError('Ocurrió un error al intentar verificar el correo.');
    }
  };

  return (
    <>
      <section id="BodyOne">
        <Header/>
        
        <Box 
          className="RectanguloBase" 
          sx={{ 
            padding: '30px', 
            width: '100%', 
            maxWidth: '400px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', // Alineación hacia la parte superior
            height: 'auto', // Permitir que el contenedor ajuste su altura
            marginBottom: '50px', // Agregar margen inferior para no superponerse al pie de página
          }}
        >
          {/* Título dentro del cuadrado azul en la parte superior */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'white', marginBottom: '10px', fontSize: '30px' }}
          >
            Recuperar Contraseña
          </Typography>

          {/* Texto adicional justo debajo del título */}
          <Typography
            variant="body1"
            sx={{ color: 'white', marginBottom: '30px', fontSize: '18px' }}
          >
            Ingresa tu correo existente para poder restablecer tu contraseña
          </Typography>

          {/* Formulario debajo del texto adicional */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{ style: { borderRadius: 50, backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'white',
                      },
                    },
                  }}
                />
                {error && (
                  <Typography color="error" variant="body2" mt={2}>
                    {error}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    fontSize: '17px',
                    backgroundColor: '#28639B',
                    color: '#ffffff',
                    borderRadius: 20,
                    marginTop: '30px',
                    height: '50px',
                  }}
                >
                  <b>Enviar</b>
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </section>
      <Footer />
    </>
  );
};

export default RecuperarContraseñaBotica;
