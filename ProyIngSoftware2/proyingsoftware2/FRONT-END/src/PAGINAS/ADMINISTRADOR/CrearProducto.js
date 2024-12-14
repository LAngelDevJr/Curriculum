import HeaderAdmin from '../../COMPONENTES/Header_Admin.js'; // Asegúrate de importar el Header correcto
import BarraHorizontal from '../../COMPONENTES/BarraHorizontalBotica.js'; // Barra de navegación creada previamente
import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Input, InputLabel, Select, FormControl, MenuItem, Checkbox, ListItemText, useStepperContext } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';

//eliminar archivo
const AgregarProducto = () => {
    // Manejo de estado para los campos del formulario
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        caracteristicas: '',
        marca: '',
        serie: '',
        precio: '',
        presentacion: '',
        stock: '',
        imagen: '',
        imagenURL: '',
        categorias: [],
        rsLetras: '',
        rsNumeros: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const handleLetrasChange = (e)=>{
      const value = e.target.value.toUpperCase();
      if(/^[A-Z]{0,3}$/.test(value)) {
        setProducto({
          ...producto,
          rsLetras: value
        })
      }
    }

    const handleNumerosChange = (e)=>{
      const value = e.target.value;
      if(/^\d{0,6}$/.test(value)) {
        setProducto({
          ...producto,
          rsNumeros: value
        })
      }
    }

    const handleCategoryChange = (event) => {
      setSelectedCategories(event.target.value);
      setProducto({
        ...producto,
        categorias: event.target.value,
      });
    };

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value,
        });
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
                const user = JSON.parse(localStorage.getItem('user'));
                console.log(user.id);
                console.log(producto.rsLetras)
                console.log(producto.rsNumeros)
                try {

                  const formData = new FormData();
                  formData.append('nombre', producto.nombre);
                  formData.append('presentacion', producto.presentacion);
                  formData.append('registroSanitario', producto.rsLetras + "-" + producto.rsNumeros);
                  formData.append('marcaID', producto.marca);
                  formData.append('boticaID', user.id);
                  formData.append('descripcion', producto.descripcion);
                  producto.categorias.forEach((categoria)=>{
                    formData.append('categorias[]',categoria)
                  })

                  const caracteristicasArray = producto.caracteristicas.split(',');
                  caracteristicasArray.forEach(caracteristica => {
                    formData.append('caracteristicas[]',caracteristica.trim());
                  })
                  formData.append('imagen', producto.imagen); 

                  const response = await fetch('http://localhost:4000/api/productos/newProducto', {
                    method: 'POST',
                    body: formData,
  
                  });
                  if(response.ok){
                    const data = await response.json();
                    console.log(data);
                    const stock = await fetch('http://localhost:4000/api/stock/newStock', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ProductoId: data.Producto.id,
                        cantidad: producto.stock,
                        precio: producto.precio
                      }), 
                    });

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
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* Descripción */}
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
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
                      }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Presentación"
                      name="presentacion"
                      value={producto.presentacion}
                      onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Marca"
                      name="marca"
                      value={producto.marca}
                      onChange={handleChange}
                      inputMode =  "numeric"
                      inputProps ={{min: 1}}
                      type = "number"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}></Typography>,
                      }}
                    />
                </Grid>
            </Grid>

            {/* Tipo, Stock */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={1}>
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      value={producto.stock}
                      onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                      <InputLabel id= "categories-label">Categorías</InputLabel>
                      <Select
                        labelId='categories-label'
                        id = "categories-select"
                        multiple 
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        renderValue={(selected) => selected.join(', ')}

                      >
                        {['Adulto mayor', 'Infantil', 'Medicamentos', 'Vitaminas'].map((category) =>
                          <MenuItem key={category} value= {category}>
                            <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                              <ListItemText primary={category} />
                          </MenuItem>
                      )}

                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>         
                      <TextField 
                        label = "Registro Sanitario"
                        value = {producto.rsLetras}
                        onChange={handleLetrasChange}
                        sx={{mr:1}}
                        inputProps={{maxLength: 3}}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}></Typography>,
                        }}
                        
                      />
                      <Typography variant='"h6' sx={{mx: 1}} > - </Typography>
                      <TextField
                        label=""
                        value={producto.rsNumeros}
                        onChange={handleNumerosChange}
                        inputProps={{
                          maxLength:6,
                        }}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}></Typography>,
                        }}
                          
                      />

                    </Box>
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
