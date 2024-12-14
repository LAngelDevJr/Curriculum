import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 
import moment from 'moment-timezone';


const Orden = sequelize.define('Orden',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "Pendiente"
    },
    direccionEnvio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    costoEnvio: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    impuestos: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: () => moment.tz('America/Lima').toDate 
    },
}, {
    freezeTableName: true,
    timestamps: false,
});;

export default Orden;