import React from "react";
import PropTypes from "prop-types";
import { Button, TableCell, TableRow } from "@mui/material";

function ContenidoTablaAdmin(props) {
    const { admin, onEstadoChange } = props;

    const handleEstadoToggle = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/adminMaestro/cambiarEstadoAdmin/${admin.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                onEstadoChange(admin.id); 
              } else {
                console.error('Error al cambiar el estado del producto');
              }

        } catch (error) {
            console.error("Error al cambiar el estado:", error);
        }
    };

    return (
        <TableRow key={admin.id}>
            <TableCell sx={{ textAlign: "center" }}>{admin.id}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.nombre}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.apellidoPaterno}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.apellidoMaterno}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.correo}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.Botica.nombre}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.Botica.ruc}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.dni}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{admin.estado}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>
            {admin.estado === 'Activado' ? (
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

ContenidoTablaAdmin.propTypes = {
    admin: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        apellidoPaterno: PropTypes.string.isRequired,
        apellidoMaterno: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        Botica: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            ruc: PropTypes.string.isRequired,
        }).isRequired,
        dni: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
    onEstadoChange: PropTypes.func.isRequired,
};

export default ContenidoTablaAdmin;
