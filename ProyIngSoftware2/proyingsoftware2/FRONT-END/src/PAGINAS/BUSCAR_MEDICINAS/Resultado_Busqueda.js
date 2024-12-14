import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Button } from '@mui/material';
import Header1 from '../../COMPONENTES/Header_Principal';
import NavegacionMedicinas from '../../COMPONENTES/NavegacionMedicinas';
import Footer from '../../COMPONENTES/Footer_Principal';
import ContenidoPaginaBusqueda from './ContenidoBusquedaMedicina.js';

const ResultadoBusqueda = () => {
  const location = useLocation();
  const { query } = location.state || { query: '' }; 
  const [filteredStocks, setFilteredStocks] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const productsPerPage = 8; 
  const [totalPages, setTotalPages] = useState(1); 
  const [searchError, setSearchError] = useState(''); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const respuesta = await fetch(`http://localhost:4000/api/productoDetalle/searchProductos?nombreProducto=${query}`);
        const data = await respuesta.json();

        if (!respuesta.ok) {
          setSearchError(data.message || 'Error al buscar productos.'); 
          setFilteredStocks([]); 
          return; 
        }

        const baseUrl = `http://localhost:4000/api/productoDetalle/`; 

        const producto_busqueda = data.ProductosDetalles.map(dato => ({
          id: dato.id || 'Sin ID',
          name: dato.Producto?.nombre || 'Sin nombre',
          marca: dato.Producto?.Marca?.nombre || 'Sin marca',
          botica: dato.Producto?.Botica?.nombre || 'Sin botica',
          direccion: dato.Botica?.direccion || 'Sin dirección',
          cantidad: dato.cantidad || 0,
          image: `${baseUrl}${dato.imageUrl || ''}`,
          precio: dato.precio || 0,
          estado: dato.estado || false, 
          boticaEstado: dato.Botica?.estado || false 
        }));

        setFilteredStocks(producto_busqueda);
        setTotalPages(Math.ceil(producto_busqueda.length / productsPerPage));
        setSearchError(''); 
      
      } catch (error) {
        console.error('Error de conexión:', error);
        setSearchError('Servidor caído. Intenta más tarde.'); 
        setFilteredStocks([]); 
      }
    };

    fetchProductos();
  }, [query]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredStocks
    .filter((item) => item.estado && item.boticaEstado) // Filtrar productos con estado y boticaEstado en true
    .slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i + 1}
        variant="contained"
        onClick={() => handlePageClick(i + 1)}
        style={{ margin: '0 5px', backgroundColor: '#567C8D' }}
        disabled={currentPage === i + 1}
      >
        {i + 1}
      </Button>
    ));
  };

  return (
    <div>
      <Header1 />
      <NavegacionMedicinas />
      <Box sx={{ flexGrow: 1, padding: 4 }}>
        {searchError ? (
          <Box textAlign="center" padding={4}>
            {searchError}
          </Box>
        )  : (
          <>
            <Grid
              container
              spacing={3}
              justifyContent="flex-start"
              alignItems="flex-start"
              paddingRight={'10%'}
              paddingLeft={'10%'}
            >
              {currentProducts.map(stock => (
                <ContenidoPaginaBusqueda
                  key={stock.id}
                  caractProducto={stock}
                  style={{ marginLeft: '10px', backgroundColor: '#567C8D' }}
                />
              ))}
            </Grid>

            <Box textAlign="center" marginTop={4}>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{ marginLeft: '10px', backgroundColor: '#567C8D' }}
              >
                Anterior
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '10px', backgroundColor: '#567C8D' }}
              >
                Siguiente
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default ResultadoBusqueda;
