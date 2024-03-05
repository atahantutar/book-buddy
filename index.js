import express from "express";
import postgresClient from "./config/db.js";
import dotenv from "dotenv";
import routers from "./routers/index.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(`/`, routers);

app.listen(process.env.PORT, () => {
  console.log(`Server running ${process.env.PORT}`);
  postgresClient.connect((err) => {
    err
      ? console.log(`connection error${err}`)
      : console.log(`Db connection successful`);
  });
});
