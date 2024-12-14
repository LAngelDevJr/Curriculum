import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 
import moment from 'moment-timezone';


const ProductoDetalle = sequelize.define('ProductoDetalle',{
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    caracteristicas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: () => moment.tz('America/Lima').toDate // Hora de Lima, Perú
    },
    imageUrl: {
        type: DataTypes.STRING
        ,allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false
});;

export default ProductoDetalle;