import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';
import Footer from '../../COMPONENTES/Footer_Principal';

const CodigoContraseña = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const email = localStorage.getItem('recuperacion');

  const handleVerificarCodigo = async () => {
    if (!codigo.trim()) {
      setError('Por favor, ingrese el código de verificación');
      return;
    }

    try {
      // Petición al backend para verificar el código
      const response = await fetch('http://localhost:4000/api/usuarios/codigoContrasenia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, codigo: codigo}),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        setSuccess('Código verificado correctamente. Redirigiendo...');
        setTimeout(() => {
          navigate('/RestablecerContraseña'); // Redirige a la vista de restablecer contraseña
        }, 1500);
      } else {
        setError(data.message || 'Código inválido o expirado.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setError('Ocurrió un error al intentar verificar el código.');
    }
  };

  return (
    <>
      <section id="BodyTwo">
        <Header2 />
        <Box
          className="RectanguloBase"
          sx={{
            padding: '30px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: 'auto',
            marginBottom: '50px',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'white', marginBottom: '10px', fontSize: '30px' }}
          >
            Verificar Código
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: 'white', marginBottom: '30px', fontSize: '18px' }}
          >
            Ingresa el código de verificación enviado a tu correo: <b>{email}</b>
          </Typography>

          {/* Input y Validación */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Código de verificación"
                variant="outlined"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
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
              {success && (
                <Typography color="success" variant="body2" mt={2}>
                  {success}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  fontSize: '17px',
                  backgroundColor: '#28639B',
                  color: '#ffffff',
                  borderRadius: 20,
                  marginTop: '30px',
                  height: '50px',
                }}
                onClick={handleVerificarCodigo}
              >
                <b>Verificar</b>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </section>
      <Footer />
    </>
  );
};

export default CodigoContraseña;
