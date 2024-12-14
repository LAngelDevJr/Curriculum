import React from "react";
import PropTypes from "prop-types";
import { Button, TableCell, TableRow } from "@mui/material";

function ContenidoTablaUsuario(props) {
    const { usuario, onEstadoChange } = props;
    
    const handleEstadoToggle = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/adminMaestro/cambiarEstadoUsuario/${usuario.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                onEstadoChange(usuario.id); 
              } else {
                console.error('Error al cambiar el estado del producto');
              }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
        }
    };

    return (
        <TableRow key={usuario.id}>
            <TableCell sx={{ textAlign: "center" }}>{usuario.id}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.nombre}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.apellidoPaterno}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.apellidoMaterno}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.fechaRegistro.slice(0, 10)}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.correo}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.telefono}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.dni}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{usuario.estado}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>
            {usuario.estado === 'Activado' ? (
                <Button size="small" color="secondary" onClick={handleEstadoToggle} >
                    <strong>Desactivar</strong>
                </Button>
            ) : (
                <Button size="small" color="secondary" onClick={handleEstadoToggle}>
                    <strong>Activar</strong>
                </Button>
            )}
            </TableCell>
        </TableRow>
    );
}

ContenidoTablaUsuario.propTypes = {
    usuario: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        apellidoPaterno: PropTypes.string.isRequired,
        apellidoMaterno: PropTypes.string.isRequired,
        fechaRegistro: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        dni: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
    onEstadoChange: PropTypes.func.isRequired,
};

export default ContenidoTablaUsuario;
