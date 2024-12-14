import React, { useState } from 'react';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';
import '../REGISTROS/Rcss.css';
import Footer from '../../COMPONENTES/Footer_Principal';

const RegistroAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
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

    // Validación de campos vacíos
    for (let key in formData) {
      if (!formData[key]) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
      }
    }

    // Verifica que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    // Validación para que el correo termine en @botica.com
    if (!formData.email.endsWith('@botica.com')) {
      setErrorMessage('El correo electrónico debe terminar en @botica.com');
      return;
    }

    // Validación de longitud de DNI
    if (formData.dni.length !== 8) {
      setErrorMessage('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    // Obtén el boticaID desde el localStorage
    const boticaID = localStorage.getItem('boticaID');
    if (!boticaID) {
      setErrorMessage('No se encontró el ID de la botica. Registra la botica primero.');
      return;
    }

    // Realiza la solicitud POST al backend
    try {
      const response = await fetch('http://localhost:4000/api/Admin/registrar', {
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
          dni: formData.dni,
          boticaID: boticaID 
        }), 
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminNombre', `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`);
        console.log('Administrador registrado con éxito');
        navigate('/InicioSesionBotica'); 
      } else {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
        setErrorMessage(errorData.message || 'Error al registrar el administrador');
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
              Registro de Administrador (1era etapa)
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  variant="outlined"
                  required
                  placeholder="example@botica.com"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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
                  InputProps={{ style: { borderRadius: 50, marginBottom:'30px', backgroundColor:'white' } }}
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

export default RegistroAdmin;
