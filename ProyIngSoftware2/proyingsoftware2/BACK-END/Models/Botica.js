import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 

const Botica = sequelize.define('Botica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-incremental
    },
    ruc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horarioAbre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horarioCierre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion_latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true, // Permitir valores nulos
    },
    direccion_longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true, // Permitir valores nulos
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Valor predeterminado: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default Botica;
