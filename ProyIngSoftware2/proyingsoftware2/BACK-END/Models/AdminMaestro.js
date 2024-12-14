import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js";


const AdminMaestro = sequelize.define(
    "AdminMaestro",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellidoPaterno: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellidoMaterno: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dni: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 8], // DNI no tiene más de 8 dígitos
                isNumeric: true, // Son números
            },
            unique: true, // Único
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true, // Formato de e-mail
            },
            unique: true, // Único
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);



export default AdminMaestro;
