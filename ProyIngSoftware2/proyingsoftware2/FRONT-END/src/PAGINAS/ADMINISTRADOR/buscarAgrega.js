import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, TableContainer, Paper } from '@mui/material';
import { DataGrid, GridRowModes, renderActionsCell } from '@mui/x-data-grid';
const Buscar = ({nombre, marca, handleProductoChange,update}) => {

    //Pasarle un json con el producto elegido del array de productos mostrados
    const child =  async (producto) => {
        console.log(producto)
        handleProductoChange("id", producto.id)
        console.log(producto.id)
        handleProductoChange("nombre",producto.nombre)
        handleProductoChange("marca",producto.Marca.nombre)
        alert('Producto Seleccionado');
        
    }


        
    const boton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    //style={{ marginLeft: 16 }}
                    sx= {{backgroundColor:'black'}}
                    onClick={() =>{
                        child(params.row)                       
                    }}
                >
                    Seleccionar
                </Button>
            </strong>
        )
    }
    

    const divStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        border: '1px solid black', // Optional for visibility
      };
      const [row,setRow] = useState([]);
      const [loading,setLoading] = useState(true);
      
      

      useEffect( ()=>{
          const fetchProductos = async ()=>{
              setLoading(true)
              try{
                const data = await buscarProducto(nombre, marca);
                setRow(data);
              }
              catch(error){
                console.error("Error en la busqueda", error);
              } finally{
                setLoading(false);
              }

          };
          fetchProductos();
      }, [update]);      

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'presentacion', headerName: 'Presentación', width: 130 },
       { 
            field: 'categoria', 
            headerName: 'Categoría', 
            width: 200,
        },
        { 
            field: 'estado', 
            headerName: 'Estado', 
            width: 100,
            type: 'boolean',
            valueGetter: (value) => value && !!value,
        },
        { field: 'nRegistroSanitario', headerName: 'Registro Sanitario', width: 150 },
       { 
            field: 'fechaRegistro', 
            headerName: 'Fecha de Registro', 
            width: 150,
            type: 'date',
            valueGetter: (value) => value && new Date(value),
        },
        { 
            field: 'Marca', 
            headerName: 'Marca', 
            width: 130,
            valueGetter: (value) => value && value.nombre,
        },

        { field: 'boton', 
          headerName: 'Botones', 
          width: 145,
          renderCell: boton
        
        },


      ];

   
      
    const paginationModel = { page: 0, pageSize: 5 };


    const buscarProducto = async(nombre, marca) =>{
        const response = await fetch(`http://localhost:4000/api/productos/BusquedaAgrega?nombre=${nombre}&marca=${marca}`, {
            method:'GET',
        });
        const data = await response.json();
        return data; 
    }

    if(loading){
        return <div>Loading...</div>;
    }



    return (
        <div
         style={divStyle} 
        >
            
            <Paper sx={{heigh:'100%', width: 'auto'}} >
                <DataGrid
                    rows={row}
                    columns={columns}
                    disableRowSelectionOnClick
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}        

               />
            </Paper>

        </div>
    )
}
export default Buscar;