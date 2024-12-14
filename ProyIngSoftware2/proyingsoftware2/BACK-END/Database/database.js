import { Sequelize } from "sequelize";

class Database {
    constructor() {
        if (!Database.instance) {
       
            this.sequelize = new Sequelize({
                dialect: "postgres",
                database: "dosisxtra",
                username: "postgres",
                password: "pass",
                host: "localhost",
                port: 5432, 
                ssl: false,
                clientMinMessages: "notice",
            });
            Database.instance = this; 
        }
        return Database.instance; 
    }

  
    authenticate() {
        return this.sequelize.authenticate();
    }

   
    sync() {
        return this.sequelize.sync();
    }

    getInstance() {
        return this.sequelize;
    }
}


const instance = new Database(); 
Object.freeze(instance); 

export default instance.getInstance(); // 