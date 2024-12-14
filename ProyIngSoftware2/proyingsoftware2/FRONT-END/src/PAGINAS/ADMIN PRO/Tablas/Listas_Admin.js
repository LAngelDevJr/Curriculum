import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header_Admin from "../../../COMPONENTES/Header_Admin";
import BarraHorizontalSuperAdmin from "../../../COMPONENTES/BarraSuperAdmin";
import ContenidoTablaAdmin from "../Contenido Tablas/ContenidoTablasAdmin";

const ListaAdmin = () => {
    const [administradores, setAdministradores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdministradores = async () => {
            const admin = JSON.parse(localStorage.getItem("adminMaestro"));
            if (admin) {
                try {
                    const respuesta = await fetch(`http://localhost:4000/api/adminMaestro/listaAdmins`);
                    const resultado = await respuesta.json();

                    const admins = resultado.map(admin => ({
                        id: admin?.id || "Sin ID",
                        nombre: admin?.nombre || "Sin nombre",
                        apellidoPaterno: admin?.apellidoPaterno || "Sin apellido P",
                        apellidoMaterno: admin?.apellidoMaterno || "Sin apellido M",
                        correo: admin?.correo || "Sin correo",
                        Botica: {
                            nombre: admin?.Botica?.nombre || "Sin Botica",
                            ruc: admin?.Botica?.ruc || "Sin RUC",
                        },
                        dni: admin?.dni || "Sin DNI",
                        estado: admin?.estado === true ? "Activado" : "Desactivado",
                    }));
                    setAdministradores(admins);
                } catch (error) {
                    console.error("Error al obtener los administradores", error);
                }
            } else {
                console.error("No se encontró Admin en el localstorage");
                navigate("/InicioSesionBotica");
            }
        };
        fetchAdministradores();
    }, [navigate]);

    const actualizarEstadoAdmin = (idAdmin) => {
        setAdministradores(prevAdministradores =>
            prevAdministradores.map(admin =>
                admin.id === idAdmin 
                    ? { ...admin, estado: admin.estado === 'Activado' ? 'Desactivado' : 'Activado' } 
                    : admin
            )
        );
    }

    return (
        <>
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
                            Boticas
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
                                    <TableCell sx={{ textAlign: "center" }}>Correo</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Nombre Botica</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>RUC</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>DNI</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Estado</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {administradores.length === 0 ? (
                            <TableRow>
                            <TableCell colSpan={10} sx={{ textAlign: "center" }}>
                                No hay ninguna botica.
                            </TableCell>
                            </TableRow>
                            ) : (
                                administradores.map((admin) => (
                                    <ContenidoTablaAdmin
                                    key={admin.id}
                                    admin={admin}
                                    onEstadoChange={actualizarEstadoAdmin}
                                    />
                                ))
                            )}
</TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
};

export default ListaAdmin;
