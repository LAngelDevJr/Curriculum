import HeaderAdmin from '../../COMPONENTES/Header_Admin.js'; // Asegúrate de importar el Header correcto
import BarraHorizontal from '../../COMPONENTES/BarraHorizontalBotica.js'; // Barra de navegación creada previamente
import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Input, InputLabel, Select, FormControl, MenuItem, Checkbox, ListItemText, useStepperContext, modal } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';
import Popup from '../ADMINISTRADOR/popup.js';
import Buscar from '../ADMINISTRADOR/buscarAgrega.js';
import { useNavigate } from 'react-router-dom';

const AgregarProducto = () => {
    // Manejo de estado para los campos del formulario
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        caracteristicas: '',
        marca: '',
        precio: '',
        stock: '',
        imagen: '',
        imagenURL: '',
        id:''
    });
    const logeado = JSON.parse(localStorage.getItem('admin'));
    const boticaID = logeado?.id;



    const [errorMessage, setErrorMessage] = useState('');
    const [pop, setpop ] = useState(false);
    const handleOpen = () => setpop(true);
    const handleClose = () => setpop(false);
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();
    const handleUpdate = () => {
      setUpdate(!update)
    }

    const handleProductoChange = (name,value) =>{
      setProducto( producto => ({
        ...producto,
        [name]: value,
      }));
    }

    const handleChange = (e) => {
        if(e.target.name==="precio" || e.target.name === "stock"){
          const numero = e.target.value === '' || /^[0-9]*\.?[0-9]*$/.test(e.target.value) ? e.target.value : producto.precio;

          setProducto({
            ...producto,
            [e.target.name]: numero
          });
        } else{
          setProducto({
              ...producto,
              [e.target.name]: e.target.value,
          });
      }
    };
    const handleImageChange = (e) => {
      if(e.target.files && e.target.files[0]){
        const selectedFile = e.target.files[0];
        const imageUrl = URL.createObjectURL(selectedFile);
      
      console.log("FUNCIONA IMAGEN", selectedFile)
      console.log("URL CREADA", imageUrl)


      setProducto({
          ...producto,
          imagen: selectedFile,
          imagenURL: imageUrl,
      });
    }
  };

    const handleSubmit = async () => {
                // Aquí iría la lógica para guardar el producto, como una llamada a la API.
                console.log("esata funcionando")
                const admin = JSON.parse(localStorage.getItem('admin'));
                console.log(admin.id);
                console.log("funciona hasta aca")
                console.log(producto.rsLetras)
                console.log(producto.rsNumeros)
                
                try {

                  const formData = new FormData();
                  formData.append('productoID', producto.id);
                  formData.append('boticaID', admin.id);
                  formData.append('descripcion', producto.descripcion);
                  formData.append('precio', producto.precio);
                  formData.append('cantidad',producto.stock);
                  const caracteristicasArray = producto.caracteristicas.split(',');
                  caracteristicasArray.forEach(caracteristica => {
                    formData.append('caracteristicas[]',caracteristica.trim());
                  })
                  formData.append('imagen', producto.imagen); 

                  const response = await fetch('http://localhost:4000/api/productoDetalle/newDetalle', {
                    method: 'POST',
                    body: formData,
  
                  });
                  if(response.ok){
                    const data = await response.json();
                    console.log(data);
                    alert("Se agrego el producto exitosamente")
                  } else {
                    alert('Hubo un problema con la solicitud, intente nuevamente más tarde')
                  }
                  
                } catch (error) {
                  setErrorMessage('Hubo un problema con la solicitud, intente nuevamente más tarde');
                  console.error('Error en la solicitud:', error);
                }


    };

    return(
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <HeaderAdmin/>
            <BarraHorizontal/>
            <Box sx={{ flex: 1, mt: 4, mx: 4, overflow: 'auto' }}>
                
                {/* Sección de Agregar Producto */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center', // Centra el texto horizontalmente
                    alignItems: 'center', // Centra el texto verticalmente
                    backgroundColor: '#D6E9FE', // Fondo color celeste
                    padding: '10px 20px',
                    borderRadius: '8px',
                    mb: 4,
                    height: '50px' // Establece una altura fija si es necesario
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Agregar Producto
                  </Typography>
                </Box>

                {/* Formulario para agregar producto */}
                <Grid container spacing={3} sx={{ flex: 1 }}>
                <Grid container spacing={3} sx={{ height: '100%' }}>
    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={4}
          sx={{
            backgroundColor: '#F5F5F5', // Fondo gris claro
            padding: 2,
            flexGrow: 1, // Esto permite que el Paper ocupe todo el espacio disponible dentro del Grid
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
         <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
              {/* Imagen del Producto */}
              {producto.imagenURL &&(
                <Box 
                  sx = {{ 
                      mb: 2,
                      widht: '100%',
                      display:'flex',
                      justifyContent: 'center',

                }}>
                    <img src={producto.imagenURL} alt = "Producto" width="400" />
                </Box>
              )}
              <Button variant="outlined" component="label" sx= {{}}>
                  Agregar Imagen
                  <input type="file" accept= "image/*" hidden onChange={handleImageChange}/>
              </Button>
            </Box>

        </Paper>
    </Grid>

    <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={4}
          sx={{
            backgroundColor: '#F5F5F5', // Fondo gris claro
            padding: 4,
            flexGrow: 1, // Esto permite que el Paper ocupe todo el espacio disponible dentro del Grid
            display: 'flex',
            flexDirection: 'column',
          }}
        >
            {/* Nombre */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="nombre"
                      value={producto.nombre}
                      onChange={handleChange}
                      sx = {{mb:2}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Marca"
                      name="marca"
                      type = "text"
                      value={producto.marca}
                      onChange={handleChange}
                    />
                </Grid>
                <Grid item sx= {4} alignItems = {"center"}>
                  
                  <Box sx={{ mt: 1, ml: 'auto', textAlign: 'right' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      //onClick={handleSubmit}
                      sx={{ backgroundColor: 'black' }} // Fondo negro para el botón
                      onClick={handleOpen}
                    >
                        BUSCAR
                    </Button>
                  </Box>
                </Grid>
                <Popup
                  pop = {pop}
                  handleClose = {handleClose}
                  handleUpdate = {handleUpdate}
                >
                  
                  <Buscar handleProductoChange = {handleProductoChange} nombre = {producto.nombre} marca = {producto.marca} update = {update} />

                </Popup>
                

              </Grid>

            {/* Descripción */}
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            {/* Características */}
            <TextField
              fullWidth
              label="Características"
              name="caracteristicas"
              value={producto.caracteristicas}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            {/* Marca, Serie, Precio */}
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Precio"
                      name="precio"
                      value={producto.precio}
                      onChange={handleChange}
                         InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                        inputProps:{
                          style:{
                            apperance: 'none'
                          }
                        }
                      }}
                      
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      value={producto.stock}
                      onChange={handleChange}
                    />
                </Grid>
            </Grid>
            
            {/* Botón Guardar */}
            <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ backgroundColor: 'black' }} // Fondo negro para el botón
                >
                    Guardar
                </Button>
            </Box>
        </Paper>
    </Grid>
</Grid>

                </Grid>

            </Box>
        </Box>
    );
};

export default AgregarProducto;
