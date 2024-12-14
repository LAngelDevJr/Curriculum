import Header_Botica from '../../COMPONENTES/Header_Botica';
import BarraHorizontalBotica from '../../COMPONENTES/BarraHorizontalBotica';
import ContenidoTablaOrdenesBotica from '../USUARIO_BOTICA/Contenido Tablas/ContenidoTablaOrdenesBotica';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Pagination } from '@mui/material';
import { DataGrid, GridRowModes, renderActionsCell } from '@mui/x-data-grid';
const OrdenesBotica = () => {
    // Estado para controlar la búsqueda y las órdenes
    const [busqueda, setBusqueda] = useState('');
    const [ordenesBotica, setOrdenesBotica] = useState([
        { id: 1, usuario: 'Juan Sanchez', fecha: '11/03/2023', total: 'S/125.00', correo: 'altavista@123.com', estado: 'Entregado' },
        { id: 2, usuario: 'Carlos Perez', fecha: '12/03/2023', total: 'S/150.00', correo: 'carlos@correo.com', estado: 'Pendiente' },
        { id: 3, usuario: 'Maria Garcia', fecha: '13/03/2023', total: 'S/200.00', correo: 'maria@correo.com', estado: 'Entregado' },
        // Se pueden agregar más órdenes aquí...
    ]);

    const admin = JSON.parse(localStorage.getItem('admin'));
    

    const handleSearchChange = (e) => {
        setBusqueda(e.target.value);
    };
    const boton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    //style={{ marginLeft: 16 }}
                >
                    Ver
                </Button>
            </strong>
        )
    }

    const [row,setRow] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect( ()=>{
        const fetchOrdenes = async ()=>{
            setLoading(true)
            try{
              const data = await buscarOrdenes();
              setRow(data);
            }
            catch(error){
              console.error("Error en la busqueda", error);
            } finally{
              setLoading(false);
            }

        };
        fetchOrdenes();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Usuario', width: 150, 
        },
        { field: 'fechaRegistro', headerName: 'Fecha de Orden', width: 130, type: 'date', 
            valueGetter: (value) => value && new Date(value),
         },
        { field: 'total', headerName: 'Total', width: 130 },
        { field: 'correo', headerName: 'Correo', width: 130,
         },
        { field: 'estado', headerName: 'Estado', width: 130 },
        { field: 'acciones', 
            headerName: 'Acciones', 
            width: 145,
            renderCell: boton
          },

    ]

    const paginationModel = { page: 0, pageSize: 5 };

    const buscarOrdenes = async() =>{
        const response = await fetch(`http://localhost:4000/api/ordenes/OrdenesAll?boticaID=${admin.id}`, {
            method:'GET',
        });
        const data = await response.json();
        return data; 
    }

    if(loading){
        return <div>Loading...</div>;
    }   



    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
                <Header_Botica />
            </Box>

            <BarraHorizontalBotica />

            <Box sx={{ flexGrow: 1, mx: 4, mt: 4, overflow: 'auto' }}>
                {/* Sección de Órdenes */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#D6E9FE',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    mb: 4,
                    height: '50px'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Órdenes
                  </Typography>
                </Box>

                {/* Tabla de Órdenes */}
                <Paper sx={{heigh:'100%', width: '100%'}} >
                <DataGrid
                    rows={row}
                    columns={columns}
                    disableRowSelectionOnClick
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}        

               />
            </Paper>

            </Box>
        </Box>
    );
};

export default OrdenesBotica;
