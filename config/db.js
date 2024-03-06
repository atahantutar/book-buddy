import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const postgresClient = new pg.Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

postgresClient.connect((err) => {
  err
    ? console.log(`connection error${err}`)
    : console.log(`Db connection successful`);
});

export default postgresClient;
