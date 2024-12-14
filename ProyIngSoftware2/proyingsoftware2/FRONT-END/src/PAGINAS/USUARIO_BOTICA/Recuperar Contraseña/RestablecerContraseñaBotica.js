import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../COMPONENTES/Header_2.js';
import Footer from '../../../COMPONENTES/Footer_Principal';

const RestablecerContraseñaBotica = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};


  useEffect(() => {
    // Redirige a la página de inicio de sesión si no hay email
    if (!email) {
      navigate('/InicioSesionBotica');
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Petición para actualizar la contraseña en el backend
      const response = await fetch('http://localhost:4000/api/admin/restablecerContrasenaAdmin', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('Contraseña restablecida con éxito');
        navigate('/InicioSesionBotica'); 
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error al intentar restablecer la contraseña:', error);
      setError('Ocurrió un error al intentar restablecer la contraseña.');
    }
  };

  return (
    <>
      <section id="BodyOne">
        <Header/>
        <Box className="RectanguloBase" sx={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: 'white', marginBottom: '20px', fontSize: '30px' }}
          >
            Restablecer Contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nueva contraseña"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{ style: { borderRadius: 50, backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar nueva contraseña"
                  variant="outlined"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{ style: { borderRadius: 50, backgroundColor: 'white' } }}
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
                  <b>Restablecer Contraseña</b>
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

export default RestablecerContraseñaBotica;
