import React, { useState } from 'react';
import { TextField, Grid, Button, Box, Typography, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../../COMPONENTES/Header_2.js';
import '../../REGISTROS/IScss.css';
import Footer from '../../../COMPONENTES/Footer_Principal.js';

const InicioSesionBotica = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/admin/iniciarSesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('admin', JSON.stringify({
          id: data.admin.id,
          nombre: data.admin.nombre,
          apellidoPaterno: data.admin.apellidoPaterno,
        }));
        navigate('/DashboardBotica');
      } else {
        alert(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      alert('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
    }
  };

  return (
    <>
      <section id="BodyOne">
        <Header2 />
        <Box className="RectanguloBase">
          <form onSubmit={handleSubmit}>
            <div>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '100px',
                  fontSize: '30px',
                }}
              >
                Iniciar Sesión
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid sx={{ width: '100%' }}>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  label="Correo electrónico"
                  variant="outlined"
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
              </Grid>
              <Grid sx={{ marginTop: '50px', width: '100%', marginBottom: '5px' }}>
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  label="Contraseña"
                  variant="outlined"
                  required
                  type="password"
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
              </Grid>
              <Grid item xs={12}>
                <div className="divolvide">
                  <a className="olvide" onClick={() => navigate('/RecuperarContraseñaBotica')}>
                    Olvidé mi contraseña
                  </a>
                </div>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    fontSize: '17px',
                    backgroundColor: '#28639B',
                    color: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                    height: '50px',
                  }}
                >
                  <b>Entrar</b>
                </Button>
              </Grid>
            </Grid>
            <Box mt={2} className="RA">
              <p>¿Deseas que tu botica se una a nuestra página?</p>
              <a onClick={() => navigate('/RegisBotica')}>
                <b>Registra a tu Botica aquí</b>
              </a>
              <div className="divolvide">
                <a className="olvide" onClick={() => navigate('/InicioSesion')}>
                  Iniciar Sesión Usuario
                </a>
              </div>
            </Box>
          </form>
        </Box>
        {/* Icono de botón en la esquina inferior derecha */}
        <IconButton
            sx={{
              position: 'fixed',
              bottom: 10,
              right: 10,
              backgroundColor: '#28639B',
              color: 'white',
              borderRadius: '50%',
              opacity: 0.1, // Transparencia inicial
              '&:hover': {
                backgroundColor: '#174a74',
                opacity: 0.2, // Menos transparente al pasar el mouse
              },
            }}
            onClick={() => navigate('/InicioSesionSuperAdmin')}
          >
            <PersonIcon />
          </IconButton>

      </section>
      <Footer />
    </>
  );
};

export default InicioSesionBotica;
