import express from "express";
import auth from "../middleware/auth.js";
import adBook from "../controllers/books.js";

const router = express.Router();

router.get("/getbooks");
router.post("/addbook", auth, adBook);
router.post("/updatebook", auth);
router.delete("/books/:id", auth);

export default router;
