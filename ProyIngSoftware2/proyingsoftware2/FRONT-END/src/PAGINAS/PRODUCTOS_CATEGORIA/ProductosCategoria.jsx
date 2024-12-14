import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header1 from '../../COMPONENTES/Header_Principal';
import NavegacionMedicinas from '../../COMPONENTES/NavegacionMedicinas';
import Footer from '../../COMPONENTES/Footer_Principal';
import './ProCat.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';


const ProductosCategoria = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const baseUrl = `http://localhost:4000/api/productoDetalle/`;

  useEffect(() => {
    fetch(`http://localhost:4000/api/productos/categoria/${categoria}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then(data => {
        // Aquí agregamos la URL base a la imagen
        const productosConImagen = data.map((producto) => ({
          ...producto,
          imageUrl: `${baseUrl}${producto.ProductoDetalle?.imageUrl || ''}`, // Concatenamos la URL base con imageUrl
        }));
        setProductos(productosConImagen); // Guardamos los productos con la URL correcta
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
      });
  }, [categoria]);

  return (
    <>
      <Header1 />
      <NavegacionMedicinas />
      
      <div className='DivTextoGrande'>
        <p className="TextoGrande">{categoria}</p>
      </div>
        <div className="div-base">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="div-contenedor">
              <div className='DivImagen'>
                <img className='Imagen'
                  src={producto.imageUrl}
                  alt={producto.nombre}
                />
                </div>
                <p style={{fontWeight: 'bold',color: '#888',marginBottom: '5px', marginTop: '0px'}}>
                  {producto.Marca?.nombre || 'Sin marca'}
                </p>
                <h3 style={{fontWeight: 'bold', marginBottom: '5px', textAlign: 'left',fontSize: '16px', marginTop: '0px'}}>
                  {producto.nombre}
                </h3>
                <p style={{color: '#888',marginBottom: '10px', marginTop: '0px'}}>
                  Por {producto.ProductoDetalle?.Botica?.nombre || 'Sin botica'}
                </p>

                <p style={{color: '#4CAF50',fontWeight: 'bold',fontSize: '18px', marginBottom: '30px',}}>
                  S/.{producto.ProductoDetalle?.precio.toFixed(2)}
                </p>

              <Link
                to={`/detalles/${producto.id}`}
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: '#5f9fbf',
                    width: '80%',
                    padding: '8px 16px',
                    margin: '0 auto',
                    '&:hover': {
                      backgroundColor: '#3b5968',
                    },
                  }}
                >
                  VER MÁS
                </Button>
              </Link>
            </div>
           ))
          
          ) : (
            <p>No se encontraron productos en esta categoría.</p>
          )}
        </div>

        <Footer/> 
        
    </>
    
  );
};

export default ProductosCategoria;



