import React, { useState } from 'react';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';
import './Rcss.css';
import Footer from '../../COMPONENTES/Footer_Principal';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    dni: '',
    password: '',
    confirmarPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Verifica si las contraseñas coinciden
    if (formData.password !== formData.confirmarPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
  
    // Realiza la solicitud POST al backend
    try {
      const response = await fetch('http://localhost:4000/api/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          password: formData.password,
          correo: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
        }), 
      });
  
      if (response.ok) {
        const data = await response.json();
        // Guarda el nombre y apellido en localStorage
        localStorage.setItem('usuario', JSON.stringify({
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          password: formData.password,
          correo: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
        }));
        localStorage.setItem('correo', formData.email);
        console.log('Usuario registrado con éxito');
        navigate('/VerificarCodigo');; // Redirige a donde necesites
      } else {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData); // Imprimir el error completo
        setErrorMessage(errorData.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      setErrorMessage('Hubo un problema con la solicitud, intente nuevamente más tarde');
      console.error('Error en la solicitud:', error);
    }
  };
  
  return (
    <>
      <Header2 />
      <section id="Cuerpo">
        <article id="WallpaperIzquierda">
          <br/>
          <br/>
          <br/> 
          <h2>DosisXtra</h2>
          <p>“Tu salud, nuestra prioridad. Llevamos bienestar hasta tu puerta”</p>
        </article>

        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            padding: 2
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2, marginBottom: '50px', marginTop:'20px', fontSize: '32px', color: 'rgb(1, 33, 61)'}}>
              Ingrese sus datos
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Nombre"
                  variant="outlined"
                  required
                  name="nombre"
                  onChange={handleInputChange}
                  value={formData.nombre}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  variant="outlined"
                  required
                  name="apellidoPaterno"
                  onChange={handleInputChange}
                  value={formData.apellidoPaterno}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  variant="outlined"
                  required
                  name="apellidoMaterno"
                  onChange={handleInputChange}
                  value={formData.apellidoMaterno}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  variant="outlined"
                  required
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  variant="outlined"
                  required
                  name="telefono"
                  onChange={handleInputChange}
                  value={formData.telefono}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'20px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="DNI"
                  variant="outlined"
                  required
                  name="dni"
                  onChange={handleInputChange}
                  value={formData.dni}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  variant="outlined"
                  required
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  variant="outlined"
                  required
                  type="password"
                  name="confirmarPassword"
                  onChange={handleInputChange}
                  value={formData.confirmarPassword}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor: 'white' } }}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': {
                        top: '-20px',
                        fontSize: '1.4rem',
                        color: 'gray'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: '50px', marginTop: '20px', backgroundColor: 'rgb(1, 33, 61)', '&:hover': { backgroundColor: 'rgb(0, 25, 50)' } }}
              >
                Registrarse
              </Button>
              {errorMessage && <Typography color="red" sx={{ mt: 2 }}>{errorMessage}</Typography>}
            </Box>
          </form>
        </Box>
      </section>
      <Footer />
    </>
  );
};

export default Registro;
