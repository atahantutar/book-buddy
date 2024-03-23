import express from "express";
import auth from "../middleware/auth.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getUserBooks,
  swapOffer,
  swapOffers,
  swapRequests,
} from "../controllers/books.js";

const router = express.Router();

router.get("/getbooks", getAllBooks);
router.get("/getuserbooks", auth, getUserBooks);
router.post("/addbook", auth, addBook);
router.post("/updatebook", auth);
router.delete("/books/:bookId", auth, deleteBook);
router.post("/swapoffer", auth, swapOffer);
router.get("/swapoffers", auth, swapOffers);
router.get("/swaprequests", auth, swapRequests);

export default router;
