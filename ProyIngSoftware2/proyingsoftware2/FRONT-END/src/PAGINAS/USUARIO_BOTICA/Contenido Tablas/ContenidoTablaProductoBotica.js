import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow, TextField, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
function AgregarFilaProductoBotica(props) {
  const { producto,  onEstadoChange} = props;
  const [stock, setStock] = useState("");
  const[toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle( (prev) => !prev );
};

  const handleStock = async (e)=>{
    setStock(e.target.value);
  }

  const handleEstadoChange = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/cambiarEstado/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onEstadoChange(producto.id); // Notifica al componente padre para que actualice el estado local
      } else {
        console.error('Error al cambiar el estado del producto');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  //Funcion para actualizar el stock del producto
  const handleStockChange = async () => {
    try {
      console.log(producto.id)
      console.log(stock)
      const response = await fetch(`http://localhost:4000/api/admin/cambiarStock?id=${producto.id}&stock=${stock}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      

      if (response.ok) {
        console.log(await response.json()); // Notifica al componente padre para que actualice el estado local
      } else {
        console.error('Error al cambiar el estado del producto');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };





  return (
    <TableRow key={producto.id}>
      <TableCell sx={{ textAlign: 'center' }}>{producto.id}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{producto.marca}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{producto.nombre}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>S/. {parseFloat(producto.precio).toFixed(2)}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{producto.fechaRegistro.slice(0, 10)}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{producto.stock}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{producto.estado}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>
        <Button size="small" sx={{ mr: 1 }} color="primary" onClick={handleToggle}>
          {toggle ? <CancelIcon/>:<strong>Actualizar Stock</strong>}
          </Button>
          {toggle&&(
            <Box> 
              <TextField
                type = "text"
                value={stock}
                onChange={handleStock}
              >
              </TextField>
              <Button variant = "contained" sx={{color:"white", backgroundColor:"black"}} onClick={handleStockChange}>
                  <SaveIcon/>
              </Button>
            </Box>
          )}
        {producto.estado === 'Disponible' ? (
          <Button size="small" color="secondary" onClick={handleEstadoChange} >
            <strong>Desactivar</strong>
            </Button>
        ) : (
          <Button size="small" color="secondary" onClick={handleEstadoChange}>
            <strong>Activar</strong>
            </Button>
        )}
      </TableCell>
    </TableRow>
    
  );
}

AgregarFilaProductoBotica.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    marca: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fechaRegistro: PropTypes.string.isRequired,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    estado: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired, // Permitir string o boolean
  }).isRequired,
  onEstadoChange: PropTypes.func.isRequired, // Nueva prop para notificar el cambio
};

export default AgregarFilaProductoBotica;
