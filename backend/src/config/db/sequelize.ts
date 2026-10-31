
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
);
