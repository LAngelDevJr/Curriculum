import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js";
import Botica from "./Botica.js"; // Asegúrate de importar el modelo relacionado

const Admin = sequelize.define(
    "Admin",
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
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Valor predeterminado: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

// Hook para sincronizar el estado de Botica
Admin.addHook("afterUpdate", async (admin) => {
    try {
        const { estado, boticaID } = admin;

        if (boticaID) {
            // Actualizamos el estado de la Botica relacionada
            await Botica.update(
                { estado }, // Propagamos el mismo estado
                { where: { id: boticaID } }
            );
            console.log(`Estado de Botica con ID ${boticaID} actualizado a ${estado}`);
        }
    } catch (error) {
        console.error("Error al sincronizar el estado de la Botica:", error);
        throw error;
    }
});

export default Admin;
