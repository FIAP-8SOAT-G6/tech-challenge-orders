import "dotenv/config";

type DatabaseConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
};

const config: { [key: string]: DatabaseConfig } = {
  development: {
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT)!
  }
};

export default config;
