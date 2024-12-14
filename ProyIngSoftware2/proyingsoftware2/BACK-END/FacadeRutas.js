import productoRoutes from "./Controladores/Productos.js";
import usuarioRoutes from "./Controladores/Usuarios.js";
import ordenRoutes from "./Controladores/Ordenes.js";
import adminRoutes from "./Controladores/Admin.js";
import productoDetalleRoutes from "./Controladores/ProductosDetalle.js"; 
import carritoRoutes from "./Controladores/Carrito.js";
import ordenesRoutes from "./Controladores/Carrito.js";
import boticaRoutes from "./Controladores/Botica.js";
import marcasRoutes from "./Controladores/Marcas.js";
import adminMaestroRoutes from "./Controladores/AdminMaestro.js";


export default function(app){
    app.use("/api/productos", productoRoutes);
    app.use("/api/usuarios", usuarioRoutes);
    app.use("/api/ordenes", ordenRoutes);
    app.use("/api/admin",adminRoutes);
    app.use("/api/botica",boticaRoutes);
    app.use("/api/productoDetalle",productoDetalleRoutes);
    app.use("/api/carrito", carritoRoutes);
    app.use("/api/ordenes", ordenesRoutes);
    app.use("/api/marcas",marcasRoutes);   
    app.use("/api/adminMaestro",adminMaestroRoutes)
    
}