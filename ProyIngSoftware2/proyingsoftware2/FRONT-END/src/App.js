import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material'; // Asegúrate de importar Box desde MUI
import Eleccion from './PAGINAS/PAG_PRINCIPAL/Eleccion';
import InicioSesion from './PAGINAS/REGISTROS/InicioSesion';
import Registro from './PAGINAS/REGISTROS/Registro';
import VerificarCodigo from './PAGINAS/REGISTROS/VerificarCodigo';
import RecuperarContraseña from './PAGINAS/REGISTROS/RecuperarContraseña';
import CodigoContraseña from './PAGINAS/REGISTROS/CodigoContraseña';
import RestablecerContraseña from './PAGINAS/REGISTROS/RestablecerContraseña';
import MisOrdenes from './PAGINAS/ORDENES/MisOrdenes';
import BusquedaMedicina from './PAGINAS/BUSCAR_MEDICINAS/BusquedaMedicina';
import BoticasCercanas from './PAGINAS/BOTICAS_CERCANAS/BoticasCercanas';

import Mapa from './PAGINAS/BOTICAS_CERCANAS/Mapa.js';

import DetallesProductos from './PAGINAS/BUSCAR_MEDICINAS/Detalles';
import ResultadoBusqueda from './PAGINAS/BUSCAR_MEDICINAS/Resultado_Busqueda';
import CarritoCompras from './PAGINAS/CARRITO_COMPRAS/CarritoCompras';
import PaginaPago from './PAGINAS/CARRITO_COMPRAS/PaginaPago';
// Vistas de administrador
import Dashboard from './PAGINAS/ADMINISTRADOR/Dashboard';
import OrdenesUsuario from './PAGINAS/ADMINISTRADOR/OrdenesUsuario';
import AgregarProducto from './PAGINAS/ADMINISTRADOR/AgregarProducto';
import ListaUsuarios from './PAGINAS/ADMINISTRADOR/ListaUsuarios';
import ListaProductos from './PAGINAS/ADMINISTRADOR/ListaProductos';
// Vistas de Botica
import AgregarProductoBotica from './PAGINAS/USUARIO_BOTICA/AgregarProductoBotica';
import DashboardBotica from './PAGINAS/USUARIO_BOTICA/DashboardBotica';
import ListaProductosBotica from './PAGINAS/USUARIO_BOTICA/ListaProductoBotica';
import OrdenesBotica from './PAGINAS/USUARIO_BOTICA/OrdenesBotica';
import InicioSesionBotica from './PAGINAS/USUARIO_BOTICA/Inicio Sesion/InicioSesionBotica.js';
import RecuperarContraseñaBotica from './PAGINAS/USUARIO_BOTICA/Recuperar Contraseña/RecuperarContraseñaBotica.js';
import RestablecerContraseñaBotica from './PAGINAS/USUARIO_BOTICA/Recuperar Contraseña/RestablecerContraseñaBotica.js';

import RegisBotica from './PAGINAS/USUARIO_BOTICA/Registro_Botica.js';
import RegisAdmin from './PAGINAS/ADMINISTRADOR/RegisAdmin.js';
import PerfilUsuario from './PAGINAS/PerfilUsuario/PerfilUser.jsx';
import ProductosCategoria from './PAGINAS/PRODUCTOS_CATEGORIA/ProductosCategoria.jsx';

// Vistas Admin Maestro
import InicioSesionSuperAdmin from './PAGINAS/ADMIN PRO/InicioSesionSuperAdmin.js';
import DashboardSuperAdmin from './PAGINAS/ADMIN PRO/DashboardSuperAdmin.js';
import ListaAdmin from './PAGINAS/ADMIN PRO/Tablas/Listas_Admin.js';
import ListaUsuariosAdmin from './PAGINAS/ADMIN PRO/Tablas/Listas_Usuario.js';


import MasVendido from './PAGINAS/PAG_PRINCIPAL/MasVendido.js';

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1 }}> 
          <Routes>
            <Route path="/" element={<Eleccion />} />
            <Route path="/InicioSesion" element={<InicioSesion />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/VerificarCodigo" element={<VerificarCodigo/>}/>
            <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
            <Route path="/CodigoContraseña" element={<CodigoContraseña />} />
            <Route path="/RestablecerContraseña" element={<RestablecerContraseña />} />
            <Route path="/MisOrdenes" element={<MisOrdenes/>}/>
            <Route path="/BusquedaMedicina" element={<BusquedaMedicina />} />
            <Route path="/BoticasCercanas" element={<BoticasCercanas />} />
            <Route path="/detalles/:id" element={<DetallesProductos />} />
            <Route path="/ResultadoBusqueda" element={<ResultadoBusqueda />} />
            <Route path="/Dashboard" element={<Dashboard/>} />
            <Route path="/OrdenesUsuario" element={<OrdenesUsuario/>} />
            <Route path="/AgregarProducto" element={<AgregarProducto/>} />
            <Route path="/ListaUsuarios" element={<ListaUsuarios/>} />
            <Route path="/ListaProductos" element={<ListaProductos/>} />
            <Route path="/CarritoCompras" element={<CarritoCompras/>} />
            <Route path='/PaginaPago' element={<PaginaPago/>}/>
            <Route path='/AgregarProductoBotica' element={<AgregarProductoBotica/>}/>
            <Route path='/DashboardBotica' element={<DashboardBotica/>}/>
            <Route path='/ListaProductosBotica' element={<ListaProductosBotica/>}/>
            <Route path='/OrdenesBotica' element={<OrdenesBotica/>}/>
            <Route path='/InicioSesionBotica' element={<InicioSesionBotica/>}/>
            <Route path='/DashboardSuperAdmin' element={<DashboardSuperAdmin/>}/>
            <Route path='/RegisBotica' element={<RegisBotica/>}/>
            <Route path='/RegisAdmin' element={<RegisAdmin/>}/>
            <Route path='/RecuperarContraseñaBotica' element={<RecuperarContraseñaBotica/>}/>
            <Route path='/RestablecerContraseñaBotica' element={<RestablecerContraseñaBotica/>}/>
            <Route path='/InicioSesionSuperAdmin' element={<InicioSesionSuperAdmin />} />
            <Route path="/perfil/:id" element={<PerfilUsuario />} />
            <Route path="/mapa" element={<Mapa />} />
            
            <Route path="/productos/categoria/:categoria" element={<ProductosCategoria />} />
            <Route path="/ListaAdmin" element={<ListaAdmin />} />
            <Route path="/ListaUsuariosAdmin" element={<ListaUsuariosAdmin />} />
            <Route path="/MasVendido" element={<MasVendido />} />

          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

