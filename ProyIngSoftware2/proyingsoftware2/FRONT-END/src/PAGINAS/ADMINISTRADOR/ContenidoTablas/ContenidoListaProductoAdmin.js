import React from "react";
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow } from '@mui/material';

function AgregarFilaProductoAdmin(props) {
  const { producto } = props;

  return (
    <TableRow key={producto.id}>
      <TableCell>{producto.id}</TableCell>
      <TableCell>{producto.nombre}</TableCell>
      <TableCell>{producto.precio}</TableCell>
      <TableCell>{producto.fechaRegistro}</TableCell>
      <TableCell>{producto.stock}</TableCell>
      <TableCell>{producto.estado}</TableCell>
      <TableCell>
        <Button size="small" sx={{ mr: 1 }} color="primary">Ver</Button>
        {producto.estado === 'Disponible' ? (
          <Button size="small" color="secondary">Desactivar</Button>
        ) : (
          <Button size="small" color="primary">Activar</Button>
        )}
      </TableCell>
    </TableRow>
  );
}

AgregarFilaProductoAdmin.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.string.isRequired,
    fechaRegistro: PropTypes.string.isRequired,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    estado: PropTypes.string.isRequired,
  }).isRequired,
};

export default AgregarFilaProductoAdmin;
