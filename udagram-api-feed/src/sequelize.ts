import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { config } from "./config/config";

export const sequelize = new Sequelize({
  username: config.username,
  password: config.password,
  database: config.database,
  host: config.host,
  dialect: config.dialect as Dialect,
  port: 5432,

  // Always use SSL for RDS connections, but handle it properly
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  // Add logging to debug SQL queries
  logging: (msg) => console.log("SQL:", msg),

  // Connection pool settings
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // Define options for table creation
  define: {
    timestamps: true,
    freezeTableName: false,
    underscored: false,
  },
});
