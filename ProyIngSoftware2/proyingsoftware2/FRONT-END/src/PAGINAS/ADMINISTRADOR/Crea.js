import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Input, InputLabel, Select, FormControl, MenuItem, Checkbox, ListItemText, useStepperContext } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
const divStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 800,
    border: '1px solid black', 
  };

const  CrearProducto = () =>{

    const [producto, setProducto] = useState({
        nombre: '',
        marca: '',
        presentacion: '',
        categorias: [],
        rsLetras: '',
        rsNumeros: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const [crearMarca, setCrearMarca] = useState(false);
    const [nuevaMarca, setNuevaMarca] = useState('');
    const [update, setUpdate] = useState(false);



    const handleNuevaMarca = (e) =>{
        setNuevaMarca(e.target.value)
    }
    

    const handleToggle = () => {
        setCrearMarca( (prev) => !prev );
    };

    const [marcas, setMarcas] = useState([]);
    useEffect(()=>{
        const fetchMarcas = async () =>{
            const response = await fetch("http://localhost:4000/api/marcas/MarcaAll",{
                method: 'GET',
            });
            const data = await response.json();
            setMarcas(data);
        }
        fetchMarcas();

    },[update]);


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

    const handleMarcaSubmit = async () =>{
      try{  
        const body = {
              nombre: nuevaMarca
          };
          const response = await fetch('http://localhost:4000/api/marcas/newMarca',{
              method: 'POST',
              headers: {
                  'Content-type': 'application/json'
              },
              body: JSON.stringify(body),
          })
          if(response.ok){
            alert("Marca creada con exito")
          }
        console.log(body)
      } catch (error){
        setErrorMessage('Hubo un problema con la solicitud, intente nuevamente más tarde');
        console.error('Error en la solicitud:', error);
      }
    }

    const handleSubmit = async () => {
        // Aquí iría la lógica para guardar el producto, como una llamada a la API.
        console.log("esata funcionando")
        console.log(producto)
        try {

            const body = {
                nombre: producto.nombre,
                presentacion: producto.presentacion,
                registroSanitario: producto.rsLetras + "-" + producto.rsNumeros,
                marcaID: producto.marca,
                descripcion: producto.descripcion,
                categorias: producto.categorias
              };

          const response = await fetch('http://localhost:4000/api/productos/newProductos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(body),

          });
          if(response.ok){
            alert("Producto creado con exito");
          } else{
            alert("Ocurrio un error al crear el producto")
          }
        
          
        } catch (error) {
          setErrorMessage('Hubo un problema con la solicitud, intente nuevamente más tarde');
          console.error('Error en la solicitud:', error);
        }


};

    return(
    
        <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column' }}>
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

            {/* Marca, Serie, Precio */}
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Presentación"
                      name="presentacion"
                      value={producto.presentacion}
                      onChange={handleChange}
                    />
                </Grid>
                <Grid sx={{ml:2}}>
                    {!crearMarca&&<FormControl style={{width: 150, marginTop: 16}}>
                            <InputLabel id="Marcalabel">Marca</InputLabel>
                            <Select
                            labelId="Marca-label"
                            id="Marca-select"
                            name = "marca"
                            value={producto.marca}
                            label="Marca"
                            onChange={handleChange}
                            
                            
                            > 
                                {marcas.map((Marca) =>
                                    <MenuItem key= {Marca.nombre}value= {Marca.id} ><ListItemText primary={Marca.nombre}/></MenuItem>
                                )}
                            </Select>
                    </FormControl>}
                    {crearMarca && (
                            <Grid >
                                <TextField
                                    label="Marca"
                                    margin="normal"
                                    value={nuevaMarca}
                                    onChange={handleNuevaMarca}
                                    fullWidth
                                />
                            </Grid>
                        )}
                </Grid>
                <Grid>
                    
                </Grid>
                {crearMarca&&<Grid sx={{ml:2, mt:3}}>
                        <Button variant = "contained" sx={{color:"white", backgroundColor:"black"}} onClick={handleMarcaSubmit}>
                            <SaveIcon/>
                        </Button>
                </Grid>}
                <Grid sx={{ml:2, mt:3}}>            
                        <Button variant="contained" color="primary" sx={{color:"white", backgroundColor:"black"}} onClick={()=>{handleToggle(); setUpdate(!update)}}>
                            {crearMarca ? <CancelIcon/> : <AddCircleOutlineIcon/>}
                        </Button>
                        
                </Grid>
            </Grid>

            {/* Tipo, Stock */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                
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
                        {['Adulto mayor', 'Infantil', 'Medicamentos', 'Vitaminas y Suplementos'].map((category) =>
                          <MenuItem key={category} value= {category}>
                            <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                              <ListItemText primary={category} />
                          </MenuItem>
                      )}

                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{display: 'flex', alignItems: 'center', width:'100%'}}>         
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
            <Box sx={{ mt: 2, textAlign: 'right' }}>
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
   
    )


}

export default CrearProducto