import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./Models/Relaciones.js"
import sequelize from "./Database/database.js"; 
import FacadeRutas from "./FacadeRutas.js";


const app = express();
const port = process.env.PORT || 4000;


app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


async function verificacionConexion() {
    try {
        await sequelize.authenticate();
        console.log("Conexión satisfactoria con la BD");

        await sequelize.sync(); 
        console.log("Modelos sincronizados con la BD");
    } catch (error) {
        console.error("No se puede conectar a la BD", error);
    }
}


FacadeRutas(app);

/*
app.listen(port, function () {
    console.log("Servidor escuchando en el puerto " + port);
    verificacionConexion(); 
    });
*/

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, function () {
        console.log("Servidor escuchando en el puerto " + port);
        verificacionConexion(); 
    });
}


export { app, port };

