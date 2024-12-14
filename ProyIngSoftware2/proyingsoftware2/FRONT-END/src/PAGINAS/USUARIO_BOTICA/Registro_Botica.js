import React, { useState } from 'react';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';
import '../REGISTROS/Rcss.css';
import Footer from '../../COMPONENTES/Footer_Principal';

const RegistroBotica = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ruc: '',
    nombre: '',
    horarioAbre: '',
    horarioCierre: '',
    direccion: '',
    direccion_latitude: '',
    direccion_longitude: ''
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

    const { ruc, nombre, horarioAbre, horarioCierre, direccion } = formData;

    // Verificar si los campos obligatorios están completos
    if (!ruc || !nombre || !horarioAbre || !horarioCierre || !direccion) {
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Validación de horario: que el cierre no sea menor que la apertura
    if (horarioCierre <= horarioAbre) {
      setErrorMessage('La hora de cierre debe ser mayor que la hora de apertura.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/Botica/registrarBotica', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...formData,
              direccion_latitude: formData.direccion_latitude || null,
              direccion_longitude: formData.direccion_longitude || null
          })
      });
  
      if (response.ok) {
          const data = await response.json();
          localStorage.setItem('boticaID', data.botica.id);
          console.log('Botica registrada con éxito');
          navigate('/RegisAdmin');
      } else {
          const errorData = await response.json();
          console.error('Detalles del error:', errorData);
          setErrorMessage(errorData.mensaje || 'Error al registrar la botica');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Hubo un problema con la solicitud, intente nuevamente más tarde');
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
              Registro de Botica
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="RUC"
                  variant="outlined"
                  required
                  name="ruc"
                  onChange={handleInputChange}
                  value={formData.ruc}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Nombre"
                  variant="outlined"
                  required
                  name="nombre"
                  onChange={handleInputChange}
                  value={formData.nombre}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Horario Abre"
                  variant="outlined"
                  required
                  type="time"
                  name="horarioAbre"
                  onChange={handleInputChange}
                  value={formData.horarioAbre}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Horario Cierre"
                  variant="outlined"
                  required
                  type="time"
                  name="horarioCierre"
                  onChange={handleInputChange}
                  value={formData.horarioCierre}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Dirección"
                  variant="outlined"
                  required
                  name="direccion"
                  onChange={handleInputChange}
                  value={formData.direccion}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Latitud (opcional)"
                  variant="outlined"
                  name="direccion_latitude"
                  onChange={handleInputChange}
                  value={formData.direccion_latitude}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Longitud (opcional)"
                  variant="outlined"
                  name="direccion_longitude"
                  onChange={handleInputChange}
                  value={formData.direccion_longitude}
                  InputProps={{ style: { borderRadius: 50, marginBottom: '30px', backgroundColor: 'white' } }}
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
                Registrar Botica
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

export default RegistroBotica;
