import React from "react";
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow } from '@mui/material';

function AgregarFilaOrdenesBotica(props) {
    const { orden } = props;
    return (
        <TableRow>
            <TableCell>{orden.id}</TableCell>
            <TableCell>{orden.usuario}</TableCell>
            <TableCell>{orden.fecha}</TableCell>
            <TableCell>{orden.total}</TableCell>
            <TableCell>{orden.correo}</TableCell>
            <TableCell>{orden.estado}</TableCell>
            <TableCell><Button variant="contained" color="primary">Ver</Button></TableCell>
        </TableRow>
    );
}

AgregarFilaOrdenesBotica.propTypes = {
    orden: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        usuario: PropTypes.string.isRequired,
        fecha: PropTypes.string.isRequired,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        correo: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
};

export default AgregarFilaOrdenesBotica;
