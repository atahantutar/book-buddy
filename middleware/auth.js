import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import postgresClient from "../config/db.js";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ succeeded: false, error: "No token available" });
    }
    const id = Jwt.verify(token, process.env.SECRET_TOKEN).id;

    const userData = await postgresClient.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    req.userId = userData.rows[0].id;

    next();
  } catch (error) {
    res.status(401).json({
      succeeded: false,
      error: "Not Authorized.",
    });
  }
};

export default auth;
