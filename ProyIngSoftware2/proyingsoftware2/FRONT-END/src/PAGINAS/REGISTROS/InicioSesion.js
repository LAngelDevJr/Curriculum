import React from 'react';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';
import './IScss.css';
import Footer from '../../COMPONENTES/Footer_Principal';

const InicioSesion = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que la página se recargue
  
    const formData = new FormData(event.target); // Captura los datos del formulario
    const email = formData.get('email'); // Obtiene el valor del campo "email"
    const password = formData.get('password'); // Obtiene el valor del campo "password"
  
    try {
      // Aquí haces la petición al endpoint de inicio de sesión
      const response = await fetch('http://localhost:4000/api/usuarios/iniciarSesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password: password }), // Envia los datos en el cuerpo de la petición
      });
  
      const data = await response.json(); // Convierte la respuesta a JSON
  
      if (response.ok) {
        // Si el inicio de sesión es exitoso
        alert('Inicio de sesión exitoso');
  
        // Almacenar los datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          nombre: data.user.nombre, 
          apellidoPaterno: data.user.apellidoPaterno, 
          id: data.user.id, 
        }));
  
        navigate('/');
      } else {
        // Mostrar mensajes específicos de error
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
                  name="email"
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
                  name="password"
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
                  <a className="olvide" onClick={() => navigate('/RecuperarContraseña')}>
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
                    width: '50%',
                    display: 'flex',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    height: '50px',
                    width: '100%',
                  }}
                >
                  <b>Entrar</b>
                </Button>
              </Grid>
            </Grid>
            <Box mt={2} className="RA">
              <p>¿Aún no tienes cuenta?</p>
              <a onClick={() => navigate('/Registro')}>
                <b>Regístrate aquí</b>
              </a>
            </Box>
            <br/>
            <div className="RA">
                  <a className="olvide" onClick={() => navigate('/InicioSesionBotica')}>
                    <b>Iniciar Sesión Botica</b>
                  </a>
                </div>
          </form>
        </Box>
      </section>
      <Footer />
    </>
  );
};

export default InicioSesion;
