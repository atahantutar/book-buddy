import postgresClient from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await postgresClient.query(
      "SELECT * FROM users WHERE email=$1 ",
      [email]
    );
    if (userCheck.rowCount == 0) {
      return res
        .status(400)
        .json({ message: "The email address is already registered." });
    }

    const comparePassword = await bcrypt.compare(
      password,
      (
        await userCheck
      ).rows[0].password
    );
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "Your password or email address is incorrect." });
    }
    const token = jwt.sign(
      { id: (await userCheck).rows[0].id },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    res.header("Authorization", token).json({ accessToken: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const register = async (req, res) => {
  try {
    const { name, surname, email, password, address } = req.body;

    const userCheck = await postgresClient.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (userCheck.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "The email address is already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const values = [name, surname, email, hashedPassword, address];
    const newUser = postgresClient.query(
      "INSERT INTO users(name,surname,email,password,address) VALUES($1,$2,$3,$4,$5) RETURNING *",
      values
    );
    const token = jwt.sign(
      { id: (await newUser).rows[0].id },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    res.header("Authorization", token).json({ accessToken: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
