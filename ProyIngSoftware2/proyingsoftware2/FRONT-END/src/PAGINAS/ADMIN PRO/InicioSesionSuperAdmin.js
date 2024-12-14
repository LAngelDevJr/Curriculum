import React, { useState } from 'react';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InicioSesionSuperAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/adminMaestro/iniciarSesionSuperAdmin', {  // Cambia la URL aquí
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso, BIENVENIDO SUPER ADMIN GOAT');
        localStorage.setItem('adminMaestro', JSON.stringify({
          id: data.admin.id,
          nombre: data.admin.nombre,
          apellidoPaterno: data.admin.apellidoPaterno,
          dni: data.admin.dni,
        }));

        navigate('/DashboardSuperAdmin');
      } else {
        alert(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      alert('Ocurrió un error. Inténtalo nuevamente.');
    }
  };

  return (
    <section id="BodyOne">
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
        </form>
      </Box>
    </section>
  );
};

export default InicioSesionSuperAdmin;
