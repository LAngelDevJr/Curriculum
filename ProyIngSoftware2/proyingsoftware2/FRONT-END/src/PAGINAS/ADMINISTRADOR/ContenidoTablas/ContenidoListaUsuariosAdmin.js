import React from "react";
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow } from '@mui/material';

function AgregarFilaUsuariosAdmin(props) {
    const { usuario } = props;
    return (
        <TableRow key={usuario.id}>
            <TableCell>{usuario.id}</TableCell>
            <TableCell>{usuario.nombre}</TableCell>
            <TableCell>{usuario.apellido}</TableCell>
            <TableCell>{usuario.correo}</TableCell>
            <TableCell>{usuario.telefono}</TableCell> 
            <TableCell>{usuario.fechaRegistro}</TableCell>
            <TableCell>{usuario.estado}</TableCell>
            <TableCell>
                <Button size="small" sx={{ mr: 1 }} color="primary">Ver</Button>
                {usuario.estado === 'Activo' ? (
                    <Button size="small" color="secondary">Desactivar</Button>
                ) : (
                    <Button size="small" color="primary">Activar</Button>
                )}
            </TableCell>
        </TableRow>
    );
}

AgregarFilaUsuariosAdmin.propTypes = {
    usuario: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired, 
        fechaRegistro: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
};

export default AgregarFilaUsuariosAdmin;
