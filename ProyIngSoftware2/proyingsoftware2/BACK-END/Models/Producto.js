import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 
import moment from 'moment-timezone';

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-incremental
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presentacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    nRegistroSanitario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    //Desde aca cambio
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: () => moment.tz('America/Lima').toDate // Hora de Lima, Perú
    },
},{
    freezeTableName: true,
    timestamps: false
});;

export default Producto;
