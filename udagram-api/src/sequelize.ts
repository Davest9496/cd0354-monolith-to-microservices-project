import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { config } from "./config/config";

const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const isLocalhost = config.host === "localhost" || config.host === "127.0.0.1";

export const sequelize = new Sequelize({
  username: config.username,
  password: config.password,
  database: config.database,
  host: config.host,
  dialect: config.dialect as Dialect,
  dialectOptions:
    isDevelopment || isLocalhost
      ? {}
      : {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
  storage: ":memory:",
});
