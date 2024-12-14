import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header_Admin from "../../../COMPONENTES/Header_Admin";
import BarraHorizontalSuperAdmin from "../../../COMPONENTES/BarraSuperAdmin";
import ContenidoTablaUsuario from "../Contenido Tablas/ContenidoTablasUsuario";

const ListaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            const admin = JSON.parse(localStorage.getItem("adminMaestro"));
            if (admin) {
                try {
                    const respuesta = await fetch(`http://localhost:4000/api/adminMaestro/listaUsuarios`);
                    const resultado = await respuesta.json();
                    const users = resultado.map((usuario) => ({
                        id: usuario?.id || "Sin ID",
                        nombre: usuario?.nombre || "Sin nombre",
                        apellidoPaterno: usuario?.apellidoPaterno || "Sin apellido P",
                        apellidoMaterno: usuario?.apellidoMaterno || "Sin apellido M",
                        correo: usuario?.correo || "Sin correo",
                        dni: usuario?.dni || "Sin DNI",
                        fechaRegistro: usuario?.fechaRegistro || "Fecha no disponible",
                        estado: usuario?.estado === true ? "Activado" : "Desactivado",
                        telefono: usuario?.telefono || "Sin Telefono",
                    }));
                    setUsuarios(users);
                } catch (error) {
                    console.error("Error al obtener los usuarios", error);
                }
            } else {
                console.error("No se encontró Admin en el localstorage");
                navigate("/InicioSesionBotica");
            }
        };
        fetchUsuarios();
    }, [navigate]);

    const actualizarEstadoUsuario = (idUsuario) => {
        setUsuarios(prevUsuarios =>
            prevUsuarios.map(usuario =>
                usuario.id === idUsuario 
                    ? { ...usuario, estado: usuario.estado === 'Activado' ? 'Desactivado' : 'Activado' } 
                    : usuario
            )
        );
    }

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Header_Admin />
            <BarraHorizontalSuperAdmin />
            <Box sx={{ flexGrow: 1, mx: 4, mt: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#D6E9FE",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        mb: 4,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Usuarios
                    </Typography>
                </Box>
                <TableContainer component={Paper} sx={{ height: "100%" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: "center" }}>ID</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Nombre</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Apellido Paterno</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Apellido Materno</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Fecha Registro</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Correo</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Teléfono</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>DNI</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Estado</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {usuarios.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} sx={{ textAlign: "center" }}>
                            No hay ningún usuario.
                            </TableCell>
                        </TableRow>
                        ) : (
                            usuarios.map((usuario) => (
                            <ContenidoTablaUsuario
                            key={usuario.id}
                            usuario={usuario}
                            onEstadoChange={actualizarEstadoUsuario}
                            />
                        ))
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default ListaUsuario;
